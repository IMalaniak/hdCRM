const express = require('express');
const router = express.Router();
const models = require('../models/index');
const env = require('../config/env');
const crypt = require('../config/crypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
			}
		]
	});
}

//Register
router.post('/register', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const passwordData = crypt.saltHashPassword(req.body.password);

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
		if(req.body.Roles){
			models.Role.findAll({
				where: {
						[models.Sequelize.Op.or] : req.body.Roles
				}
			}).then(roles => {
				user.setRoles(roles).then(result => {
					res.status(200).json(result);
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		}
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//Auth
router.post('/authenticate', (req, res, next) => {
	const login = req.body.login;
	const password = req.body.password;
	models.User.findOne({
			where: {login: login},
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
				}
			]
		}).then(user => {
			if(!user) {
				res.status(409).json({success: false, msg: 'No user, or no user data!', status: 3});
				return;
			}

			if(user.State.id === 1) {
				res.status(409).json({success: false, msg: 'Account is not activated!', status: 1});
				return;
			} else if (user.State.id === 3) {
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
					token: 'JWT ' + token
				};

				if (user.Roles.length > 0) {
					tmpUser.Roles = user.Roles;
				}

				res.json(tmpUser);

				models.UserLoginHistory.findOrCreate({
					where: {
						UserId: user.id
					},
					defaults: {
						IP: req.connection.remoteAddress,
						dateLastLoggedIn: new Date()						
					}
				}).spread((uLogHistItem, created) => {
					models.UserLoginHistory.update({
						IP: req.connection.remoteAddress,
						dateLastLoggedIn: new Date()
					}, {
						where: {
							UserId: user.id
						}
					});
				});

			} else {
				res.status(401).json({success: false, msg: 'Password is not correct!', status: 4});
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
								[models.Sequelize.Op.or] : req.body.Roles
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
