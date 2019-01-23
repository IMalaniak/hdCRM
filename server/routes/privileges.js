const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Privilege.create({
		keyString: req.body.keyString
	}).then(result => {
		res.status(200);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Privilege.findAll().then(privileges => {
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
router.get('/list/:roleId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Privilege.findAll({
		attributes: ['id', 'keyString'],
		include: [{
			model: models.Role,
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

module.exports = router;
