const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.create({
		keyString: req.body.keyString,
	}).then(stage => {
		res.status(200).json(stage);
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

router.get('/countPlans', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.findAll({
		// attributes: {
		// 	include: [
		// 		[
		// 			models.sequelize.fn('COUNT', models.sequelize.col('StagePlans')), 'planCount'
		// 		]	
		// 	]
		// },
		include: [
			{
				model: models.Plan,
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
