const express = require('express');
const router = express.Router();
const models = require('../models/index');
const passport = require('passport');

//create
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.create({
		title: req.body.title,
		budget: req.body.budget,
		deadline: req.body.deadline,
		description: req.body.description,
		progress: 0
	}).then(plan => {
		models.User.findOne({
			where: {id: req.body.CreatorId}
		}).then(user => {
			plan.setCreator(user).then(() => {
				models.Stage.findOne({
					where: {title: 'created'}
				}).then(stage => {
					plan.setStage(stage).then(() => {
						if(req.body.Participants) {
							models.User.findAll({
								where: {
									[models.Sequelize.Op.or] : req.body.Participants
								}
							}).then(users => {
								plan.setParticipants(users).then(() => {
									res.json({success: true, msg: 'Plan created!'});
								}).catch(error => {
									res.status(400).json(error.toString());
								});
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						} else {
							res.json({success: true, msg: 'Plan created!'});
						}
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
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//List of plans
router.get('/fullList/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.findAll({
		include: [
			{
				model: models.User,
				as: 'Creator',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: {
					model: models.Asset,
					as: 'avatar'
				}
			},
			{
				model: models.User,
				as: 'Participants',
				attributes: { exclude: ['passwordHash', 'salt'] },
				through: {
					attributes: []
				}
			},
			{
				model: models.Stage
			}
		]
	}).then(plans => {
		res.json(plans);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//List of plans
router.get('/stageList/:stage', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.findOne({
		where: {id: req.params.stage}
	}).then(stage => {
		stage.getPlans({
			include: [
				{
					model: models.User,
					as: 'Creator',
					attributes: { exclude: ['passwordHash', 'salt'] },
					include: {
						model: models.Asset,
						as: 'avatar'
					}
				},
				{
					model: models.User,
					as: 'Participants',
					attributes: { exclude: ['passwordHash', 'salt'] },
					through: {
						attributes: []
					}
				},
				{
					model: models.Stage
				}
			]
		}).then(plans => {
			res.json(plans);
		}).catch(error => {
			res.status(400).json(error.toString());
		});
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//user by id
router.get('/details/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.findOne({
		where: {id: req.params.id},
		include: [
			{
				model: models.User,
				as: 'Creator',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: models.Asset,
						as: 'avatar'
					}
				]
			},
			{
				model: models.User,
				as: 'Participants',
				attributes: { exclude: ['passwordHash', 'salt'] },
				through: {
					attributes: []
				},
				include: {
					model: models.Asset,
					as: 'avatar'
				}
			},
			{
				model: models.Asset,
				as: 'Documents',
				through: {
					attributes: []
				}
			}
		]
	}).then(plan => {
		res.json(plan);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


//update plan by id
router.put('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.update(
		{
			title: req.body.title,
			description: req.body.description,
			budget: req.body.budget,
			deadline: req.body.deadline,
		},
		{
			where: {id: req.body.id}
		}
	).then(result => {
		if (result) {
			models.Plan.findOne({
				where: {id: req.body.id},
			}).then(plan => {
				if(req.body.Participants) {
					models.User.findAll({
						where: {
								[models.Sequelize.Op.or] : req.body.Participants
						}
					}).then(users => {
						plan.setParticipants(users).then(result => {
							models.Plan.findOne({
								where: {id: req.body.id},
								include: [
									{
										model: models.User,
										as: 'Creator',
										attributes: { exclude: ['passwordHash', 'salt'] },
										include: [
											{
												model: models.Asset,
												as: 'avatar'
											}
										]
									},
									{
										model: models.User,
										as: 'Participants',
										attributes: { exclude: ['passwordHash', 'salt'] },
										through: {
											attributes: []
										},
										include: {
											model: models.Asset,
											as: 'avatar'
										}
									},
									{
										model: models.Asset,
										as: 'Documents',
										through: {
											attributes: []
										}
									}
								]
							}).then(plan => {
								res.json(plan);
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

//update plan by id
router.put('/delete-doc', passport.authenticate('jwt', {session: false}), (req, res, next) => {

});

module.exports = router;
