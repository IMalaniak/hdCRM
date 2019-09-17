const express = require('express');
const router = express.Router();
// const db = require('../models/index');
const passport = require('passport');

//full list
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const messageList = [{
		id: 1,
		messages: [{
			id: 1, 
			message: "Hello World", 
			recepientId: 1, 
			senderId: 1,
		}, {
			id: 2, 
			message: "Hello World2", 
			recepientId: 1, 
			senderId: 1,
		}]
	},
	{
		id: 2,
		messages: [{
			id: 3, 
			message: "Hello Friend", 
			recepientId: 2, 
			senderId: 2,
		}]
	},
	{
		id: 3,
		messages: [{
			id: 4, 
			message: "Hello Bro", 
			recepientId: 3, 
			senderId: 3,
		}]
	}];
	res.json(messageList);
});

module.exports = router;