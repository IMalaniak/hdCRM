import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import { Op } from 'sequelize';
import Passport from '../../config/passport';

@Controller('departments/')
export class DepartmentController {
  // TODO: change to user type
  currentUser: any;

  @Get('dashboard')
  @Middleware([Passport.authenticate()])
  private getDashboardData(req: Request, res: Response) {
    Logger.Info(`Geting departments dashboard data...`);
    // TODO: req.user type
    this.currentUser = req.user;

    db.Department.findAndCountAll({
      attributes: ['title', 'id'],
      where: {
        OrganizationId: this.currentUser.OrganizationId
      },
      include: [
        {
          model: db.User,
          as: 'Workers',
          attributes: ['id'],
          required: false
        }
      ],
      order: [['id', 'ASC']]
    })
      .then(data => {
        res.status(OK).json({ list: data.rows, count: data.count });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Get(':id')
  @Middleware([Passport.authenticate()])
  private get(req: Request, res: Response) {
    Logger.Info(`Selecting department by id: ${req.params.id}...`);
    this.findDepByPk(req.params.id)
      .then((dep: db.Department) => {
        return res.status(OK).json(dep);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response) {
    Logger.Info(`Selecting all departments...`);
    // TODO: req.user type
    this.currentUser = req.user;

    const queryParams = req.query;
    const limit = parseInt(queryParams.pageSize);
    const offset = parseInt(queryParams.pageIndex) * limit;

    db.Department.findAndCountAll({
      where: {
        OrganizationId: this.currentUser.OrganizationId
      },
      include: [
        {
          model: db.Department,
          as: 'ParentDepartment',
          required: false
        },
        {
          model: db.Department,
          as: 'SubDepartments',
          required: false
        },
        {
          model: db.User,
          as: 'Workers',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ],
          required: false
        },
        {
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
      ],
      limit: limit,
      offset: offset,
      order: [[queryParams.sortIndex, queryParams.sortDirection.toUpperCase()]],
      distinct: true
    })
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        res.status(OK).json({ list: data.rows, count: data.count, pages: pages });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: Request, res: Response) {
    Logger.Info(`Creating new department...`);
    this.currentUser = req.user;

    db.Department.create({
      title: req.body.title,
      description: req.body.description,
      managerId: req.body.Manager.id,
      OrganizationId: this.currentUser.OrganizationId
    })
      .then(dep => {
        const addParentDepPromise = req.body.ParentDepartment
          ? this.addParentDepPr(dep, req.body.ParentDepartment)
          : Promise.resolve(true);
        const addSubDepartmentsPromise =
          req.body.SubDepartments && req.body.SubDepartments.length > 0
            ? this.addSubDepartmentsPr(dep, req.body.SubDepartments)
            : Promise.resolve(true);
        const addWorkersPromise =
          req.body.Workers && req.body.Workers.length > 0
            ? this.addWorkersPr(dep, req.body.Workers)
            : Promise.resolve(true);

        Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise])
          .then(() => {
            this.findDepByPk(dep.id)
              .then(dep => {
                res.status(OK).json(dep);
              })
              .catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err);
              });
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: Request, res: Response) {
    Logger.Info(`Updating department by id: ${req.params.id}...`);
    db.Department.update(
      {
        title: req.body.title,
        description: req.body.description,
        managerId: req.body.Manager.id
      },
      {
        where: { id: req.body.id }
      }
    )
      .then(dep => {
        this.findDepByPk(req.body.id)
          .then(dep => {
            const addParentDepPromise = req.body.ParentDepartment
              ? this.addParentDepPr(dep, req.body.ParentDepartment)
              : Promise.resolve(true);
            const addSubDepartmentsPromise =
              req.body.SubDepartments && req.body.SubDepartments.length > 0
                ? this.addSubDepartmentsPr(dep, req.body.SubDepartments)
                : Promise.resolve(true);
            const addWorkersPromise =
              req.body.Workers && req.body.Workers.length > 0
                ? this.addWorkersPr(dep, req.body.Workers)
                : Promise.resolve(true);

            Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise])
              .then(values => {
                this.findDepByPk(req.body.id)
                  .then(dep => {
                    res.status(OK).json(dep);
                  })
                  .catch((error: any) => {
                    Logger.Err(error);
                    return res.status(BAD_REQUEST).json(error.toString());
                  });
              })
              .catch((error: any) => {
                Logger.Err(error);
                return res.status(BAD_REQUEST).json(error.toString());
              });
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response) {
    Logger.Info(`Deleting department by id: ${req.params.id}...`);
    db.Department.destroy({
      where: { id: req.params.id }
    })
      .then(result => {
        return res.status(OK).json(result);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  private findDepByPk(id: number | string): Promise<db.Department> {
    return db.Department.findByPk(id, {
      include: [
        {
          model: db.Department,
          as: 'ParentDepartment',
          required: false
        },
        {
          model: db.Department,
          as: 'SubDepartments',
          required: false
        },
        {
          model: db.User,
          as: 'Workers',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ],
          required: false
        },
        {
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

  private addParentDepPr(dep: db.Department, parentDepartment: db.Department): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      dep
        .setParentDepartment(parentDepartment.id)
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  private addSubDepartmentsPr(dep: db.Department, subDepartments: number[]): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      db.Department.findAll({
        where: {
          [Op.or]: subDepartments
        }
      })
        .then(deps => {
          dep
            .setSubDepartments(deps)
            .then(resp => {
              resolve(resp);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  private addWorkersPr(dep: db.Department, workers: number[]): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      db.User.findAll({
        where: {
          [Op.or]: workers
        }
      })
        .then(users => {
          dep
            .setWorkers(users)
            .then(resp => {
              resolve(resp);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
