const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');


function findRoleById(roleId){
	return db.Role.findByPk(roleId, {
		include: [
			{
				model: db.User,
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				]
			}, {
				model: db.Privilege,
				through: {
					attributes: []
				}
			}
		]
	});
}

//create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Role.create({
		keyString: req.body.keyString
	}).then(role => {
		if(req.body.Privileges){
			db.Privilege.findAll({
				where: {
					[db.Sequelize.Op.or] : req.body.Privileges
				}
			}).then(privileges => {
				role.setPrivileges(privileges).then(result => {
					if(req.body.Users){
						db.User.findAll({
							where: {
									[db.Sequelize.Op.or] : req.body.Users
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

//full list with users and privileges
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const queryParams = req.query;
	let limit = parseInt(queryParams.pageSize);
	let offset = parseInt(queryParams.pageIndex) * limit;
	
	db.Role.findAndCountAll({
		include: [
			{
				model: db.Privilege,
				through: {
					attributes: []
				},
				required: false
			},
			{
				model: db.User,
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar',
						required: false
					}
				],
				required: false
			}
		],
		limit: limit,
		offset: offset,
		order: [
			[queryParams.sortIndex, queryParams.sortDirection.toUpperCase()]
		],
		distinct: true
	}).then(data => {
		let pages = Math.ceil(data.count / limit);
		res.json({list: data.rows, count: data.count, pages: pages});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//role by id
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findRoleById(req.params.id).then(role => {
		res.json(role);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


//update role
router.put('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Role.update(
		{
			keyString: req.body.keyString,
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
			findRoleById(req.body.id).then(role => {
				if(req.body.Privileges) {
					db.Privilege.findAll({
						where: {
								[db.Sequelize.Op.or] : req.body.Privileges
						}
					}).then(privileges => {
						role.setPrivileges(privileges).then(result => {
							if(req.body.Users){
								db.User.findAll({
									where: {
											[db.Sequelize.Op.or] : req.body.Users
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
