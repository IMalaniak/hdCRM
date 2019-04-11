const express = require('express');
const router = express.Router();
const db = require('../models/index');
const passport = require('passport');

function findDepByPk(id){
	return db.Department.findByPk(id, {
		include: [
			{
				model: db.Department,
				as: "ParentDepartment",
				required: false,
			}, {
				model: db.Department,
				as: "SubDepartments",
				required: false,
			}, {
				model: db.User,
				as: "Workers",
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				],
				required: false
			}, {
				model: db.User,
				as: 'Manager',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				],
				required: false
			}
		]
	});
}

function addParentDepPr(dep, parentDepartment) {
	return new Promise((resolve, reject) => {
		dep.setParentDepartment(parentDepartment.id).then(resp => {
			resolve(resp);
		}).catch(error => {
			reject(error);
		});
	});
}

function addSubDepartmentsPr(dep, subDepartments) {
	return new Promise((resolve, reject) => {
		db.Department.findAll({
			where: {
				[db.Sequelize.Op.or] : subDepartments
			}
		}).then(deps => {
			dep.setSubDepartments(deps).then(resp => {
				resolve(resp);
			}).catch(error => {
				reject(error);
			});
		}).catch(error => {
			reject(error);
		});
	});
}

function addWorkersPr(dep, workers) {
	return new Promise((resolve, reject) => {
		db.User.findAll({
			where: {
				[db.Sequelize.Op.or] : workers
			}
		}).then(users => {
			dep.setWorkers(users).then(resp => {
				resolve(resp);
			}).catch(error => {
				reject(error);
			});
		}).catch(error => {
			reject(error);
		});
	});
}

// create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Department.create({
		title: req.body.title,
		description: req.body.description,
		managerId: req.body.Manager.id
	}).then(dep => {
		const addParentDepPromise = req.body.ParentDepartment ? addParentDepPr(dep, req.body.ParentDepartment) : Promise.resolve(true);
		const addSubDepartmentsPromise = req.body.SubDepartments && req.body.SubDepartments.length > 0 ? addSubDepartmentsPr(dep, req.body.SubDepartments) : Promise.resolve(true);
		const addWorkersPromise = req.body.Workers && req.body.Workers.length > 0 ? addWorkersPr(dep, req.body.Workers) : Promise.resolve(true);

		Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise]).then(values => {
			res.status(200).json(values);
		}).catch(error => {
			res.status(400).json(error.toString());
		});

	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


// List full
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Department.findAll({
		include: [
			{
				model: db.Department,
				as: "ParentDepartment",
				required: false,
			}, {
				model: db.Department,
				as: "SubDepartments",
				required: false,
			}, {
				model: db.User,
				as: "Workers",
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				],
				required: false
			}, {
				model: db.User,
				as: 'Manager',
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Asset,
						as: 'avatar'
					}
				],
				required: false
			}
		]
	}).then(deps => {
		res.status(200).json(deps);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});

// dep by id
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	findDepByPk(req.params.id).then(dep => {
		res.status(200).json(dep);
	}).catch(error => {
		res.status(400).json(error.toString());
	});
});


//update role
router.put('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	db.Department.update({
		title: req.body.title,
		description: req.body.description,
		managerId: req.body.Manager.id
	},
	{
		where: {id: req.body.id}
	}).then(dep => {
		findDepByPk(req.body.id).then(dep => {

			const addParentDepPromise = req.body.ParentDepartment ? addParentDepPr(dep, req.body.ParentDepartment) : Promise.resolve(true);
			const addSubDepartmentsPromise = req.body.SubDepartments && req.body.SubDepartments.length > 0 ? addSubDepartmentsPr(dep, req.body.SubDepartments) : Promise.resolve(true);
			const addWorkersPromise = req.body.Workers && req.body.Workers.length > 0 ? addWorkersPr(dep, req.body.Workers) : Promise.resolve(true);
			
			Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise]).then(values => {
				findDepByPk(req.body.id).then(dep => {
					res.status(200).json(dep);
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

module.exports = router;
