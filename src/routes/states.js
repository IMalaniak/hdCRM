const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');

//create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.State.create({
		keyString: req.body.keyString,
	}).then(result => {
		res.status(200);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//full list
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.State.findAll().then(states => {
		res.json(states);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
