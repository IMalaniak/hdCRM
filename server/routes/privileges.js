const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');

// create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Privilege.create({
		keyString: req.body.keyString
	}).then(result => {
		res.status(200);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

// full list
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Privilege.findAll().then(privileges => {
		const privilegesObjNew = privileges.map(privilege => {
			return {
				id: privilege.id,
				keyString: privilege.keyString,
				selected: false
			}
		});
		res.json(privilegesObjNew);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//List for role
router.get('/:roleId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Privilege.findAll({
		attributes: ['id', 'keyString'],
		include: [{
			model: db.Role,
			where: {id: req.params.roleId},
			required: false
		}]
	}).then(privileges => {
		const privilegesObjNew = privileges.map(privilege => {
			return {
				id: privilege.id,
				keyString: privilege.keyString,
				selected: privilege.Roles.length > 0 ? true : false
			}
		});
		res.json(privilegesObjNew);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

// check User privilege
router.get('/availableForUser/:userId/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.User.findByPk(req.params.userId).then(user => {
			user.getRoles().then(roles => {
				const promises = [];
				roles.forEach(role => {
					promises.push(
						role.getPrivileges().then(privileges => {
							return privileges;
						})
					);
				});
				Promise.all(promises).then(result => {
					let resp = [].concat(...result);
					resp = [...new Set(resp.map(x => x.keyString))];
					res.json(resp);
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

// check User privilege
router.get('/checkUser/:userId/:privilege', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.User.findByPk(req.params.userId).then(user => {
			user.getRoles().then(roles => {
				const promises = [];
				roles.forEach(role => {
					promises.push(
						role.getPrivileges().then(privileges => {
							return privileges;
						})
					);
				});
				Promise.all(promises).then(result => {
					let resp = [].concat(...result);
					resp = [...new Set(resp.map(x => x.keyString))];
					resp = resp.indexOf(req.params.privilege) > 0;
					res.json(resp);
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			}).catch(error => {
				res.status(400).json(error.toString());
			});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
