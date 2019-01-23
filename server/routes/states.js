const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.State.create({
		keyString: req.body.keyString,
	}).then(result => {
		res.status(200);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list
router.get('/listFull', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.State.findAll().then(states => {
		res.json(states);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
