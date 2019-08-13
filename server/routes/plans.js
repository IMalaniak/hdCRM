const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../models/index');
const passport = require('passport');
const multerConfig = require('../multer/multerConfig');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

function findPlanById(planId) {
	return db.Plan.findByPk(planId, {
		include: [
			{
				model: db.User,
				as: 'Creator',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				]
			},
			{
				model: db.User,
				as: 'Participants',
				attributes: { exclude: ['passwordHash', 'salt'] },
				through: {
					attributes: []
				},
				include: {
					model: db.Asset,
					as: 'avatar'
				}
			},
			{
				model: db.Asset,
				as: 'Documents',
				through: {
					attributes: []
				}
			},
			{
				model: db.Stage,
				as: 'activeStage'
			},
			{
				model: db.Stage,
				as: 'Stages',
				through: {
					as: 'Details',
					attributes: { exclude: ['PlanId', 'StageId'] }
				}
			}
		],
		order: [ 
			[db.Sequelize.col('order')]
		]
	})
}

// create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

	const finish = function(planId) {
		findPlanById(planId).then(plan => {
			res.json(plan);
		}).catch(error => {
			res.status(400).json(error.toString());
		});
	}

	db.Plan.create({
		title: req.body.title,
		budget: req.body.budget,
		deadline: req.body.deadline,
		description: req.body.description,
		progress: 0
	}).then(plan => {
		db.User.findByPk(req.body.CreatorId).then(user => {
			plan.setCreator(user).then(() => {
				db.Stage.findAll({
					where: {
						keyString: {
							[db.Sequelize.Op.or]: ['created', 'inProgress', 'finished']
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
						db.User.findAll({
							where: {
								[db.Sequelize.Op.or] : req.body.Participants
							}
						}).then(users => {
							plan.setParticipants(users).then(() => {
								finish(plan.id);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					} else {
						finish(plan.id);
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

// Paginated List
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const queryParams = req.query;
	let limit = parseInt(queryParams.pageSize);
	let offset = parseInt(queryParams.pageIndex) * limit;
	
	db.Plan.findAndCountAll({
		include: [
			{
				model: db.User,
				as: 'Creator',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				]
			},
			{
				model: db.User,
				as: 'Participants',
				attributes: { exclude: ['passwordHash', 'salt'] },
				through: {
					attributes: []
				},
				include: {
					model: db.Asset,
					as: 'avatar'
				}
			},
			{
				model: db.Asset,
				as: 'Documents',
				through: {
					attributes: []
				}
			},
			{
				model: db.Stage,
				as: 'activeStage'
			},
			{
				model: db.Stage,
				as: 'Stages',
				through: {
					as: 'Details',
					attributes: { exclude: ['PlanId', 'StageId'] }
				}
			}
		],
		limit: limit,
		offset: offset,
		order: [
			[queryParams.sortIndex, queryParams.sortDirection.toUpperCase()],
			// TODO: sort
			//[db.Sequelize.literal(`"Stages->Details"."order" ASC`)]
		],
		distinct: true
	}).then(data => {
		let pages = Math.ceil(data.count / limit);
		// TODO: sort with sequelize query
		function sortByOrder(a, b) {
			return a.Details.order - b.Details.order;
		}
		data.rows.forEach(plan => {
			if(plan.Stages && plan.Stages.length > 0) {
				plan.Stages = plan.Stages.sort(sortByOrder);
			}
		});
		res.json({list: data.rows, count: data.count, pages: pages});
	}).catch(error => {
		res.status(500).json(error.toString());
	});
});

//List of plans
router.get('/stageList/:stage', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Stage.findByPk(req.params.stage).then(stage => {
		stage.getPlans({
			include: [
				{
					model: db.User,
					as: 'Creator',
					attributes: { exclude: ['passwordHash', 'salt'] },
					include: {
						model: db.Asset,
						as: 'avatar'
					}
				},
				{
					model: db.User,
					as: 'Participants',
					attributes: { exclude: ['passwordHash', 'salt'] },
					through: {
						attributes: []
					}
				},
				{
					model: db.Stage,
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

//plan by id
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findPlanById(req.params.id).then(plan => {
		res.json(plan);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


//update plan by id
router.put('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Plan.update(
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
			db.Plan.findByPk(req.body.id).then(plan => {
				if(req.body.Participants) {
					db.User.findAll({
						where: {
								[db.Sequelize.Op.or] : req.body.Participants
						}
					}).then(users => {
						plan.setParticipants(users).then(result => {
							findPlanById(req.body.id).then(plan => {
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
	db.Plan.findByPk(req.body.id).then(plan => {
		const stageIds = req.body.Stages.map(stage => {
			return {id: stage.id}
		});
		db.Stage.findAll({
			where: {
				[db.Sequelize.Op.or] : stageIds
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
				findPlanById(req.body.id).then(plan => {
					res.json(plan);
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


// set next stage active
router.get('/toNextStage/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Plan.findByPk(req.params.id, {
		attributes: ['id', 'activeStageId'],
		include: [
			{
				model: db.Stage,
				as: 'activeStage'
			},
			{
				model: db.Stage,
				as: 'Stages',
				through: {
					as: 'Details',
					attributes: { exclude: ['PlanId', 'StageId'] }
				}
			}
		],
		order: [ 
			[db.Sequelize.col('order')]
		]
	}).then(plan => {
		plan.Stages.forEach((stage, i) => {
			if (stage.id === plan.activeStageId) {	
				stage.Details.completed = true;
				stage.Details.save().then(stage => {
					if (plan.Stages[i+1]) {
						plan.setActiveStage(plan.Stages[i+1].id).then(() => {
							findPlanById(req.params.id).then(plan => {
								res.json(plan);
							}).catch(error => {
								res.status(400).json(error.toString());
							});
						}).catch(error => {
							res.status(400).json(error.toString());
						});
					} else {
						findPlanById(req.params.id).then(plan => {
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

router.post('/documents/:planId', passport.authenticate('jwt', {session: false}), multerConfig.upload.single('uploader'), (req, res, next) => {
	// we use single because filepond send file by one
	let file = {
		title: req.file.originalname,
		location: req.file.destination.split('uploads')[1],
		type: req.file.mimetype
	};

	db.Plan.findByPk(req.params.planId, {
		attributes: ['id']
	}).then(plan => {
		plan.createDocument(file).then(doc => {
			res.json(doc);
		}).catch(error => {
			res.status(400).json(error.toString());
		});
	}).catch(error => {
		res.status(400).json(error.toString());
	});

});

// update delete doc by planId
router.delete('/documents/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Plan.findByPk(req.query.planId, {
		attributes: ['id'],
		include: [
			{
				model: db.Asset,
				as: 'Documents',
				through: {
					where: { AssetId: req.query.docId },
					attributes: []
				}
			}			
		]
	}).then(plan => {
		const docToDelete = plan.Documents[0];
		db.Asset.destroy({
			where: {
				id: docToDelete.id
			}
		}).then(() => {
			// REDO to file server
			let destination = path.join(__dirname, '../../uploads');
			destination = destination + docToDelete.location + '/' + docToDelete.title;
			unlinkAsync(destination).then(() => {
				res.json({success: true, message: 'doc deleted'});
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

module.exports = router;
