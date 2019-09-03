const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const multerConfig = require('../multer/multerConfig');
var jimp = require('jimp');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const Op = db.Sequelize.Op;

function findUserById(userId){
	return db.User.findByPk(userId, {
		attributes: { exclude: ['passwordHash', 'salt'] },
		include: [
			{
				model: db.Role,
				through: {
					attributes: []
				}
			}, {
				model: db.UserLoginHistory
			}, {
				model: db.State
			}, {
				model: db.Asset
			}, {
				model: db.Asset,
				as: 'avatar'
			}, {
				model: db.Department,
				required: false,
			}
		]
	});
}

//List
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const queryParams = req.query;
	let limit = parseInt(queryParams.pageSize);
	let offset = parseInt(queryParams.pageIndex) * limit;
	
	db.User.findAndCountAll({
		attributes: { exclude: ['passwordHash', 'salt'] },
		include: [
			{
				model: db.Role,
				through: {
					attributes: []
				}
			}, {
				model: db.UserLoginHistory
			}, {
				model: db.State
			}, {
				model: db.Asset
			}, {
				model: db.Asset,
				as: 'avatar'
			}, {
				model: db.Department,
				required: false,
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
		res.status(500).json(error.toString());
	});	
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json(req.user);
});

//user by id
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findUserById(req.params.id).then(user => {
		res.json(user);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//update user by id
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.User.update(
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
					db.Role.findAll({
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

//user by id change avatar
router.post('/:id/avatar', passport.authenticate('jwt', {session: false}), multerConfig.upload.single('profile-pic-uploader'), (req, res, next) => {
	if (req.file) {	
		jimp.read(req.file.path).then(tpl => (tpl.clone().resize(100, jimp.AUTO).write(req.file.destination+'/thumbnails/'+req.file.originalname)));
	}
	db.User.findByPk(req.params.id).then(user => {
		user.getAvatar().then(avatar => {
			if (avatar) {	
				db.Asset.destroy({
					where: {id: avatar.id}
				}).then(() => {
					const uploads = path.join(__dirname, '../../uploads');
					const destination = uploads + avatar.location + '/' + avatar.title;
					const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
					unlinkAsync(destination).then(() => {
						unlinkAsync(thumbDestination).then(() => {
							let av = {
								title: req.file.originalname,
								location: req.file.destination.split('uploads')[1],
								type: req.file.mimetype
							};
							user.createAvatar(av).then(newAv => {
								res.json(newAv);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
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
				let av = {
					title: req.file.originalname,
					location: req.file.destination.split('uploads')[1],
					type: req.file.mimetype
				};
				user.createAvatar(av).then(newAv => {
					res.json(newAv);
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
});

//user by id delete avatar
router.delete('/:id/avatar', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.User.findByPk(req.params.id).then(user => {
		user.getAvatar().then(avatar => {
			if (avatar) {
				db.Asset.destroy({
					where: {id: avatar.id}
				}).then(() => {
					const uploads = path.join(__dirname, '../../uploads');
					const destination = uploads + avatar.location + '/' + avatar.title;
					const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
					unlinkAsync(destination).then(() => {
						unlinkAsync(thumbDestination).then(() => {
							res.json({success: true, message: 'avatar deleted'});
						}).catch(error => {
							res.status(400).json(error.toString());
						});					
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
});

//activate or disable user
router.put('/updateUserState', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.User.update(
		{
			StateId: req.body.StateId
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
		if (result) {
			db.User.findByPk(req.body.id, {
				attributes: ['StateId'],
				include: [{
						model: db.State
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
	  return db.User.update(
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
