const express = require('express');
const router = express.Router();
const db = require('../models/index');
const crypt = require('../config/crypt');
const jwt = require('jsonwebtoken');
const mailer = require('../mailer/nodeMailerTemplate');

const Op = db.Sequelize.Op;

function saveLogInAttempt(req, user, isSuccess) {
	const defaults = {};
	defaults.IP = req.connection.remoteAddress;
	if (isSuccess) {
		defaults.dateLastLoggedIn = new Date();
	} else {
		defaults.dateUnsuccessfulLogIn = new Date();
	}
	db.UserLoginHistory.findOrCreate({
		where: {
			UserId: user.id
		},
		defaults: defaults
	}).spread((uLogHistItem, created) => {
		if (!created) {
			uLogHistItem.IP = req.connection.remoteAddress;
			if (isSuccess) {
				uLogHistItem.dateLastLoggedIn = new Date();
			} else {
				uLogHistItem.dateUnsuccessfulLogIn = new Date();
			}
			uLogHistItem.save();
		}
	});
}

//Register
router.post('/register', (req, res, next) => {
	const password = req.body.password ? req.body.password : crypt.genRandomString(12);

	const passwordData = crypt.saltHashPassword(password);

	const sendInvitationMail = function(user) {
		const token = crypt.genTimeLimitedToken(24*60);
		user.createPasswordAttributes({
			token: token.value,
			tokenExpire: token.expireDate,
			passwordExpire: token.expireDate
		}).then(pa => {
			mailer.sendActivation(user, password, `${process.env.URL}/auth/activate-account/${token.value}`).then(() => {
				res.status(200).json({success: true, message: "Activation link has been sent"});
			}).catch(error => {
				res.status(400).json(error.toString());
			});	
		});
	}

	db.User.create({
		email: req.body.email,
		login: req.body.login,
		passwordHash: passwordData.passwordHash,
		salt: passwordData.salt,
		name: req.body.name,
		surname: req.body.surname,
		defaultLang: req.body.defaultLang,
		phone: req.body.phone,
		StateId: 1
	}).then(user => {
		if(req.body.selectedRoleIds){
			db.Role.findAll({
				where: {
					id: {
						[Op.or] : req.body.selectedRoleIds
					}	
				}
			}).then(roles => {
				user.setRoles(roles).then(result => {
					sendInvitationMail(user);
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		} else {
			sendInvitationMail(user);
		}
	}).catch(db.Sequelize.ValidationError, db.Sequelize.UniqueConstraintError, error => {
		res.status(412).json(error);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

router.post('/activate_account', (req, res, next) => {
	db.PasswordAttributes.findOne({
		where: {
			token: req.body.token,
			tokenExpire: {
				[Op.gt]: Date.now()
			}
		}
	}).then(pa => {
		if (pa) {
			pa.getUser().then(user => {
				user.StateId = 2;
				user.save().then(user => {				
					user.getPasswordAttributes().then(pa => {
						if (pa) {
							pa.token = null;
							pa.tokenExpire = null;
							pa.save().then(() => {
								mailer.sendActivationConfirmation(user).then(() => {
									res.json({success: true, message: "Successful activation!"});
								}).catch(error => {
									res.status(400).json(error.toString());
								});
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						}
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		} else {
			res.json({success: false, message: "Activation token is invalid or has expired!"});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//Auth
router.post('/authenticate', (req, res, next) => {
	const loginOrEmail = req.body.login;
	const password = req.body.password;
	db.User.findOne({
			where: {
				[Op.or]: [
					{
						login: loginOrEmail
					},
					{
						email: loginOrEmail
					}
			]},
			include: [
				{
					model: db.Role,
					through: {
						attributes: []
					},
					required: false,
					include: [
						{
							model: db.Privilege,
							through: {
								attributes: []
							},
							required: false,
						}
					]
				}, {
					model: db.State
				}, {
					model: db.Asset,
					as: 'avatar',
					required: false
				}, {
					model: db.UserLoginHistory,
					required: false
				}, {
					model: db.Department,
					required: false
				}, {
					model: db.PasswordAttributes,
					as: 'PasswordAttributes',
					attributes: ['updatedAt', 'passwordExpire'],
					required: false
				}
			]
		}).then(user => {
			if(!user) {
				res.status(409).json({success: false, message: 'No user, or no user data!', statusCode: 3});
				return;
			}

			if(user.State.id === 1) {
				saveLogInAttempt(req, user, false);
				res.status(409).json({success: false, message: 'Account is not activated!', statusCode: 1});
				return;
			} else if (user.State.id === 3) {
				saveLogInAttempt(req, user, false);
				res.status(409).json({success: false, message: 'Account is disabled!', statusCode: 2});
				return;
			}

			let isMatch = crypt.validatePassword(password, user.passwordHash, user.salt);
			if (isMatch) {
				const token = jwt.sign(user.dataValues, process.env.SECRET, {
					expiresIn: 86400  // 86400s = 1 day //604800s = 1 week
				});

				let tmpUser = {
					id: user.id,
					login: user.login,
					name: user.name,
					surname: user.surname,
					email: user.email,
					defaultLang: user.defaultLang,
					avatar: user.avatar,
					token: 'JWT ' + token,
					phone: user.phone,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt
				};

				if (user.Roles && user.Roles.length > 0) {
					tmpUser.Roles = user.Roles;
				}

				if (user.UserLoginHistory) {
					tmpUser.lastSessionData = user.UserLoginHistory;
				}

				if (user.Department) {
					tmpUser.Department = user.Department;
				}

				if (user.PasswordAttributes) {
					tmpUser.PasswordAttributes = user.PasswordAttributes;
				}

				saveLogInAttempt(req, user, true);
				res.cookie('jwt', token);
				res.json(tmpUser);
			} else {
				saveLogInAttempt(req, user, false);
				res.status(401).json({success: false, message: 'Password is not correct!', statusCode: 4});
			}
	}).catch(error => {
		res.status(400).json(error.toString());
	});

});

router.post('/forgot_password', (req, res, next) => {
	const loginOrEmail = req.body.login;

	db.User.findOne({
		where: {[Op.or]: [
			{
				login: loginOrEmail
			},
			{
				email: loginOrEmail
			}
		]}
	}).then(user => {
		if (user) {
			user.getPasswordAttributes().then(pa => {
				const token = crypt.genTimeLimitedToken(5);
				const sendPasswordResetMail = function() {
					mailer.sendPasswordReset(user, `${process.env.URL}/auth/password-reset/${token.value}`).then(() => {
						res.status(200).json({success: true, message: "Activation link has been sent"});
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				}

				if (pa) {
					pa.token = token.value;
					pa.tokenExpire = token.expireDate;
					pa.save().then(() => {
						sendPasswordResetMail();
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				} else {
					user.createPasswordAttributes({
						token: token.value,
						tokenExpire: token.expireDate,
					}).then(pa => {
						sendPasswordResetMail();
					});
				}
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		} else {
			res.json({success: false, message: 'no_user'});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
	
});

router.post('/reset_password', (req, res, next) => {
	db.PasswordAttributes.findOne({
		where: {
			token: req.body.token,
			tokenExpire: {
				[Op.gt]: Date.now()
			}
		}
	}).then(pa => {
		if (pa) {
			if (req.body.newPassword === req.body.verifyPassword) {
				pa.getUser().then(user => {
					const passwordData = crypt.saltHashPassword(req.body.newPassword);
					user.passwordHash = passwordData.passwordHash;
					user.salt = passwordData.salt;
					user.save().then(user => {
						user.getPasswordAttributes().then(pa => {
							if (pa) {
								pa.token = null;
								pa.tokenExpire = null;
								pa.save().then(() => {
									mailer.sendPasswordResetConfirmation(user).then(() => {
										res.status(200).json({success: true, message: "New password is set!"});
									}).catch(error => {
										res.status(400).json(error.toString());
									});
								}).catch(error => {
									res.status(400).json(error.toString());
								});
							}
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			} else {
				res.json({success: false, message: 'Passwords do not match'});
			}			
		} else {
			res.json({success: false, message: "Password reset token is invalid or has expired!"});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

router.get('/logout', (req, res, next) => {
	req.logout();
	// req.session.destroy((err) => {
	//   res.clearCookie('jwt');
	//   res.send('Logged out');
	// });
});

module.exports = router;
