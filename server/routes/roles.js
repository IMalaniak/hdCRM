const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');


function findRoleById(roleId){
	return models.Role.findById(roleId, {
		include: [
			{
				model: models.User,
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: models.Asset,
						as: 'avatar'
					}
				]
			}, {
				model: models.Privilege,
				through: {
					attributes: []
				}
			}
		]
	});
}

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {

	models.Role.create({
		keyString: req.body.keyString
	}).then(role => {
		if(req.body.Privileges){
			models.Privilege.findAll({
				where: {
					[models.Sequelize.Op.or] : req.body.Privileges
				}
			}).then(privileges => {
				role.setPrivileges(privileges).then(result => {
					if(req.body.Users){
						models.User.findAll({
							where: {
									[models.Sequelize.Op.or] : req.body.Users
							}
						}).then(users => {
							role.setUsers(users).then(result => {
								res.status(200).json(result);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					} else {
						res.status(200).json(result);
					}
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
		} else {
			res.status(200).json(role);
		}

	}).catch(error => {
		res.status(400).json(error.toString());
	});

});


//List full
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Role.findAll({
		where: {
			keyString: {
				$ne: 'root'
			}
		}
	}).then(roles => {
		res.json(roles);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list with users and privileges
router.get('/listFull', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Role.findAll({
		where: {
			keyString: {
				$ne: 'root'
			}
		},
		include: [
			{
				model: models.Privilege,
				through: {
					attributes: []
				}
			},
			{
				model: models.User,
				attributes: ['id', 'login'],
				through: {
					attributes: []
				}
			}
		]
	}).then(roles => {
		res.json(roles);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//role by id
router.get('/details/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findRoleById(req.params.id).then(role => {
		res.json(role);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


//update role
router.put('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Role.update(
		{
			keyString: req.body.keyString,
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
			findRoleById(req.body.id).then(role => {
				if(req.body.Privileges) {
					models.Privilege.findAll({
						where: {
								[models.Sequelize.Op.or] : req.body.Privileges
						}
					}).then(privileges => {
						role.setPrivileges(privileges).then(result => {
							if(req.body.Users){
								models.User.findAll({
									where: {
											[models.Sequelize.Op.or] : req.body.Users
									}
								}).then(users => {
									role.setUsers(users).then(result => {
										findRoleById(req.body.id).then(role => {
											res.json(role);
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
								findRoleById(req.body.id).then(role => {
									res.json(role);
								}).catch(error => {
									res.status(400).json(error.toString());
								});
							}
						});
					}).catch(error => {
						res.status(400).json(error.toString());
					});
				} else {
					res.json(role);
				}
			}).catch(error => {
				res.status(400).json(error.toString());
			});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
