import { Request, Response, Router } from 'express';
import { Service } from 'typedi/decorators/Service';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import {
  Department,
  User,
  Asset,
  ApiResponse,
  CollectionApiResponse,
  ItemApiResponse,
  CollectionQuery,
  RequestWithQuery,
  RequestWithBody
} from '../models';

@Service()
export class DepartmentRoutes {
  private router: Router = Router();

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Department>>) => {
      // Logger.Info(`Geting departments dashboard data...`);
      Department.findAndCountAll({
        attributes: ['title', 'id'],
        where: {
          OrganizationId: req.user.OrganizationId
        },
        include: [
          {
            model: User as any,
            as: 'Workers',
            attributes: ['id'],
            required: false
          }
        ],
        order: [['id', 'ASC']]
      })
        .then((data) => {
          res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.get('/:id', (req: Request<{ id: string }>, res: Response<ItemApiResponse<Department>>) => {
      // Logger.Info(`Selecting department by id: ${req.params.id}...`);
      this.findDepByPk(req.params.id)
        .then((dep: Department) => {
          if (dep) {
            return res.status(StatusCodes.OK).json({ success: true, data: dep });
          } else {
            // TODO: make the same check everywhere when we will update sequelize
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ success: false, message: 'No department with such id', data: null });
          }
        })
        .catch((err: any) => {
          // // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.get('/', (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Department>>) => {
      // Logger.Info(`Selecting all departments...`);
      const { pageSize, pageIndex, sortDirection, sortIndex } = req.query;
      const limit = parseInt(pageSize);
      const offset = parseInt(pageIndex) * limit;

      Department.findAndCountAll({
        where: {
          OrganizationId: req.user.OrganizationId
        },
        include: [
          {
            model: Department as any,
            as: 'ParentDepartment',
            required: false
          },
          {
            model: Department as any,
            as: 'SubDepartments',
            required: false
          },
          {
            model: User as any,
            as: 'Workers',
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
              {
                model: Asset as any,
                as: 'avatar'
              }
            ],
            required: false
          },
          {
            model: User as any,
            as: 'Manager',
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
              {
                model: Asset as any,
                as: 'avatar'
              }
            ],
            required: false
          }
        ],
        limit,
        offset,
        order: [[sortIndex, sortDirection.toUpperCase()]],
        distinct: true
      })
        .then((data) => {
          const pages = Math.ceil(data.count / limit);
          res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
        })
        .catch((err: any) => {
          // // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.post('/', (req: RequestWithBody<Partial<Department>>, res: Response<ItemApiResponse<Department>>) => {
      // Logger.Info(`Creating new department...`);
      Department.create({
        title: req.body.title,
        description: req.body.description,
        managerId: req.body.Manager.id,
        OrganizationId: req.user.OrganizationId
      })
        .then((createdDep) => {
          const addParentDepPromise = req.body.ParentDepartment
            ? this.addParentDepPr(createdDep, req.body.ParentDepartment)
            : Promise.resolve(true);
          const addSubDepartmentsPromise =
            req.body.SubDepartments && req.body.SubDepartments.length > 0
              ? this.addSubDepartmentsPr(createdDep, req.body.SubDepartments)
              : Promise.resolve(true);
          const addWorkersPromise =
            req.body.Workers && req.body.Workers.length > 0
              ? this.addWorkersPr(createdDep, req.body.Workers)
              : Promise.resolve(true);

          Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise])
            .then(() => {
              this.findDepByPk(createdDep.id)
                .then((dep) => {
                  res
                    .status(StatusCodes.OK)
                    .json({ success: true, message: 'Department created successfully!', data: dep });
                })
                .catch((err: any) => {
                  // Logger.Err(err);
                  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
            })
            .catch((err: any) => {
              // Logger.Err(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.put('/:id', (req: RequestWithBody<Partial<Department>>, res: Response<ItemApiResponse<Department>>) => {
      // Logger.Info(`Updating department by id: ${req.params.id}...`);
      Department.update(
        {
          title: req.body.title,
          description: req.body.description,
          managerId: req.body.Manager.id
        },
        {
          where: { id: req.body.id }
        }
      )
        .then(() => {
          this.findDepByPk(req.body.id)
            .then((updatedDep) => {
              const addParentDepPromise = req.body.ParentDepartment
                ? this.addParentDepPr(updatedDep, req.body.ParentDepartment)
                : Promise.resolve(true);
              const addSubDepartmentsPromise =
                req.body.SubDepartments && req.body.SubDepartments.length > 0
                  ? this.addSubDepartmentsPr(updatedDep, req.body.SubDepartments)
                  : Promise.resolve(true);
              const addWorkersPromise =
                req.body.Workers && req.body.Workers.length > 0
                  ? this.addWorkersPr(updatedDep, req.body.Workers)
                  : Promise.resolve(true);

              Promise.all([addParentDepPromise, addSubDepartmentsPromise, addWorkersPromise])
                .then(() => {
                  this.findDepByPk(req.body.id)
                    .then((dep) => {
                      res
                        .status(StatusCodes.OK)
                        .json({ success: true, message: 'Department updated successfully!', data: dep });
                    })
                    .catch((error: any) => {
                      // Logger.Err(error);
                      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                    });
                })
                .catch(() => {
                  // Logger.Err(error);
                  return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: 'Sorry, unexpected error happened.', data: null });
                });
            })
            .catch((error: any) => {
              // Logger.Err(error);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.delete('/:id', (req: Request<{ id: string }>, res: Response<ApiResponse>) => {
      // Logger.Info(`Deleting department by id: ${req.params.id}...`);
      Department.destroy({
        where: { id: req.params.id }
      })
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} department` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    return this.router;
  }

  private findDepByPk(id: number | string): Promise<Department> {
    return Department.findByPk(id, {
      include: [
        {
          model: Department as any,
          as: 'ParentDepartment',
          required: false
        },
        {
          model: Department as any,
          as: 'SubDepartments',
          required: false
        },
        {
          model: User as any,
          as: 'Workers',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: Asset as any,
              as: 'avatar'
            }
          ],
          required: false
        },
        {
          model: User as any,
          as: 'Manager',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: Asset as any,
              as: 'avatar'
            }
          ],
          required: false
        }
      ]
    });
  }

  private addParentDepPr(dep: Department, parentDepartment: Department): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      dep
        .setParentDepartment(parentDepartment.id)
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private addSubDepartmentsPr(dep: Department, subDepartments: { id: number }[]): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      Department.findAll({
        where: {
          [Op.or]: subDepartments
        }
      })
        .then((deps) => {
          dep
            .setSubDepartments(deps)
            .then((resp) => {
              resolve(resp);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private addWorkersPr(dep: Department, workers: { id: number }[]): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      User.findAll({
        where: {
          [Op.or]: workers
        }
      })
        .then((users) => {
          dep
            .setWorkers(users)
            .then((resp) => {
              resolve(resp);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
