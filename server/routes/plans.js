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
		models.User.findByPk(req.body.CreatorId).then(user => {
			plan.setCreator(user).then(() => {
				models.Stage.findAll({
					where: {
						keyString: {
							[models.Sequelize.Op.or]: ['created', 'inProgress', 'finished']
						}
					}
				}).then(stages => {
					for (const i in stages) {
						if (stages[i].keyString === 'created') {
							plan.setActiveStage(stages[i]);
						}
						plan.addStages(stages[i], {through: {
								order: i,
								completed: false
							}
						});
					}

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
				model: models.Stage,
				as: 'activeStage'
			}
		]
	}).then(plans => {
		res.json(plans);
	}).catch(error => {
		console.error(error);
		
		res.status(400).json(error.toString());
	});
});

//List of plans
router.get('/stageList/:stage', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Stage.findByPk(req.params.stage).then(stage => {
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
					model: models.Stage,
					as: 'activeStage'
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
	models.Plan.findByPk(req.params.id, {
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
			},
			{
				model: models.Stage,
				as: 'activeStage'
			},
			{
				model: models.Stage,
				as: 'Stages',
				through: {
					as: 'Details',
					attributes: { exclude: ['PlanId', 'StageId'] }
				}
			}
		],
		order: [ 
			[models.Sequelize.col('order')]
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
			models.Plan.findByPk(req.body.id).then(plan => {
				if(req.body.Participants) {
					models.User.findAll({
						where: {
								[models.Sequelize.Op.or] : req.body.Participants
						}
					}).then(users => {
						plan.setParticipants(users).then(result => {
							models.Plan.findByPk(req.body.id, {
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
									},
									{
										model: models.Stage,
										as: 'activeStage'
									},
									{
										model: models.Stage,
										as: 'Stages',
										through: {
											as: 'Details',
											attributes: { exclude: ['PlanId', 'StageId'] }
										}
									}
								],
								order: [ 
									[models.Sequelize.col('order')]
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

router.put('/updatePlanStages', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.findByPk(req.body.id).then(plan => {
		const stageIds = req.body.Stages.map(stage => {
			return {id: stage.id}
		});
		models.Stage.findAll({
			where: {
				[models.Sequelize.Op.or] : stageIds
			}
		}).then(stages => {
			stages = stages.map(stage => {
				const planStage = req.body.Stages.filter(reqStage => {
					return reqStage.id === stage.id;
				})[0];
				stage.PlanStages = {
					order: planStage.Details.order,
					description: planStage.Details.description,
					completed: planStage.Details.completed
				};
				return stage;
			});			
			plan.setStages(stages).then(resp => {
				res.status(200).json(resp);
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


// set next stage active
router.get('/toNextStage/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	models.Plan.findByPk(req.params.id, {
		attributes: ['id', 'activeStageId'],
		include: [
			{
				model: models.Stage,
				as: 'activeStage'
			},
			{
				model: models.Stage,
				as: 'Stages',
				through: {
					as: 'Details',
					attributes: { exclude: ['PlanId', 'StageId'] }
				}
			}
		],
		order: [ 
			[models.Sequelize.col('order')]
		]
	}).then(plan => {
		plan.Stages.forEach((stage, i) => {
			if (stage.id === plan.activeStageId) {	
				stage.Details.completed = true;
				stage.Details.save().then(stage => {
					if (plan.Stages[i+1]) {
						plan.setActiveStage(plan.Stages[i+1].id).then(() => {
							plan.reload().then(plan => {
								res.json(plan);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					} else {
						plan.reload().then(plan => {
							res.json(plan);
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					}
				}).catch(error => {
					res.status(400).json(error.toString());
				});
			}					
		});	
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

//update plan by id
router.put('/delete-doc', passport.authenticate('jwt', {session: false}), (req, res, next) => {

});

module.exports = router;
