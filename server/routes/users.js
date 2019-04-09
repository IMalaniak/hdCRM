const express = require('express');
const router = express.Router();
const models = require('../models/index');
const env = require('../config/env');
const crypt = require('../config/crypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mailer = require('../mailer/nodeMailerTemplate');

const Op = models.Sequelize.Op;

function findUserById(userId){
	return models.User.findById(userId, {
		attributes: { exclude: ['passwordHash', 'salt'] },
		include: [
			{
				model: models.Role,
				required: false,
				through: {
					attributes: []
				}
			}, {
				model: models.State
			}, {
				model: models.Asset,
				as: 'avatar'
			}, {
				model: models.Department,
				required: false,
			}
		]
	});
}

//Register
router.post('/register', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const tempPassword = crypt.genRandomString(12);

	const passwordData = crypt.saltHashPassword(tempPassword);

	const sendInvitationMail = function(user) {
		const token = crypt.genTimeLimitedToken(60);
		user.createPasswordAttributes({
			token: token.value,
			tokenExpire: token.expireDate,
			passwordExpire: token.expireDate
		}).then(pa => {
			mailer.sendActivation(user, tempPassword, `${env.URL}/auth/activate-account/${token.value}`).then(() => {
				res.status(200).json({success: true, message: "Activation link has been sent"});
			}).catch(error => {
				res.status(400).json(error.toString());
			});	
		});
	}

	models.User.create({
		email: req.body.email,
		login: req.body.login,
		passwordHash: passwordData.passwordHash,
		salt: passwordData.salt,
		name: req.body.name,
		surname: req.body.surname,
		defaultLang: req.body.defaultLang,
		phone: req.body.phone,
		StateId: 1 //change this to smth
	}).then(user => {
		if(req.body.selectedRoleIds){
			models.Role.findAll({
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
	}).catch(models.sequelize.ValidationError, models.sequelize.UniqueConstraintError, error => {
		//console.error(error);
		res.status(412).json(error);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

router.post('/activate_account', (req, res, next) => {
	models.PasswordAttributes.findOne({
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


function saveLogInAttempt(req, user, isSuccess) {
	const defaults = {};
	defaults.IP = req.connection.remoteAddress;
	if (isSuccess) {
		defaults.dateLastLoggedIn = new Date();
	} else {
		defaults.dateUnsuccessfulLogIn = new Date();
	}
	models.UserLoginHistory.findOrCreate({
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

//Auth
router.post('/authenticate', (req, res, next) => {
	const loginOrEmail = req.body.login;
	const password = req.body.password;
	models.User.findOne({
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
					model: models.Role,
					through: {
						attributes: []
					},
					required: false,
					include: [
						{
							model: models.Privilege,
							through: {
								attributes: []
							},
							required: false,
						}
					]
				}, {
					model: models.State
				}, {
					model: models.Asset,
					as: 'avatar',
					required: false
				}, {
					model: models.UserLoginHistory,
					required: false
				}, {
					model: models.Department,
					required: false,
				}
			]
		}).then(user => {
			if(!user) {
				res.status(409).json({success: false, msg: 'No user, or no user data!', status: 3});
				return;
			}

			if(user.State.id === 1) {
				saveLogInAttempt(req, user, false);
				res.status(409).json({success: false, msg: 'Account is not activated!', status: 1});
				return;
			} else if (user.State.id === 3) {
				saveLogInAttempt(req, user, false);
				res.status(409).json({success: false, msg: 'Account is disabled!', status: 2});
				return;
			}

			let isMatch = crypt.validatePassword(password, user.passwordHash, user.salt);
			if (isMatch) {
				const token = jwt.sign(user.dataValues, env.SECRET, {
					expiresIn: 86400  // 1 day //604800 1 week
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
					lastSessionData: user.UserLoginHistory,
					Department: user.Department
				};

				if (user.Roles.length > 0) {
					tmpUser.Roles = user.Roles;
				}

				saveLogInAttempt(req, user, true);

				res.json(tmpUser);
			} else {
				saveLogInAttempt(req, user, false);
				res.status(401).json({success: false, msg: 'Password is not correct!', status: 4});
			}
	}).catch(error => {
		res.status(400).json(error.toString());
	});

});

router.post('/forgot_password', (req, res, next) => {
	const loginOrEmail = req.body.login;

	models.User.findOne({
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
					mailer.sendPasswordReset(user, `${env.URL}/auth/password-reset/${token.value}`).then(() => {
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
	models.PasswordAttributes.findOne({
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

//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json(req.user);
});


//List
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.User.findAll({
		attributes: { exclude: ['passwordHash', 'salt'] },
		include: [
			{
				model: models.Role,
				through: {
					attributes: []
				}
			}, {
				model: models.UserLoginHistory
			}, {
				model: models.State
			}, {
				model: models.Asset
			}, {
				model: models.Asset,
				as: 'avatar'
			}, {
				model: models.Department,
				required: false,
			}
		]
	}).then(users => {
		res.json(users);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//List by state
router.get('/list/:stateId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.State.findOne({
		where: {id: req.params.stateId}
	}).then(state => {
		state.getUsers({
			attributes: { exclude: ['passwordHash', 'salt'] },
			include: [
				{
					model: models.Role,
					through: {
						attributes: []
					}
				}, {
					model: models.UserLoginHistory
				}, {
					model: models.State
				}, {
					model: models.Asset
				}, {
					model: models.Asset,
					as: 'avatar'
				}, {
					model: models.Department,
					required: false,
				}
			]
		}).then(users => {
			res.json(users);
		}).catch(error => {
			res.status(400).json(error.toString());
		});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//user by id
router.get('/userDetails/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findUserById(req.params.id).then(user => {
		res.json(user);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//update user by id
router.put('/updateUser', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.User.update(
		{
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			phone: req.body.phone,
			defaultLang: req.body.defaultLang,
			StateId: req.body.StateId
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
		if (result) {
			findUserById(req.body.id).then(user => {
				if(req.body.Roles) {
					models.Role.findAll({
						where: {
								[Op.or] : req.body.Roles
						}
					}).then(roles => {
						user.setRoles(roles).then(() => {
							findUserById(req.body.id).then(user => {
								res.json(user);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						});
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				} else {
					res.json(user);
				}
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//activate or disable user
router.put('/updateUserState', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.User.update(
		{
			StateId: req.body.StateId
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
		if (result) {
			models.User.findOne({
				where: {id: req.body.id},
				attributes: ['StateId'],
				include: [{
						model: models.State
					}]
			}).then(user => {
				res.json(user);
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//activate or disable user
router.put('/changeStateOfSelected', passport.authenticate('jwt', {session: false}), (req, res, next) => {

	function updateRow(userId) {
	  return models.User.update(
			{
				StateId: req.body.stateId
			},
			{
				where: {id: userId}
			}
	  );
	}

	const promises = [];
	req.body.userIds.forEach(userId => {
		promises.push(updateRow(userId));
	});

	return Promise.all(promises).then(result => {
		res.status(200).json({status: "ok"});
	}).catch(error =>{
		res.status(400).json(error.toString());
	});
});

module.exports = router;
