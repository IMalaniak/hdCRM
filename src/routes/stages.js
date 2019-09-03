const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');

//create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Stage.create({
		keyString: req.body.keyString,
	}).then(stage => {
		res.status(200).json(stage);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Stage.findAndCountAll({
		include: [
			{
				model: db.Plan,
				attributes: ['id']
			}
		]
	}).then(data => {
		res.json({list: data.rows, count: data.count});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
