const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.create({
		keyString: req.body.keyString,
	}).then(() => {
		res.status(200);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.findAll().then(stages => {
		res.json(stages);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
