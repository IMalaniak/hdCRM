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
	db.Stage.findAll().then(stages => {
		res.json(stages);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

router.get('/countPlans', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Stage.findAll({
		// attributes: {
		// 	include: [
		// 		[
		// 			db.sequelize.fn('COUNT', db.sequelize.col('StagePlans')), 'planCount'
		// 		]	
		// 	]
		// },
		include: [
			{
				model: db.Plan,
				attributes: ['id']
			}
		]
	}).then(stages => {
		const newObj = stages.map(stage => {
			return {
				id: stage.id,
				keyString: stage.keyString,
				totalPlans: stage.Plans.length
			}
		});
		res.json(newObj);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
