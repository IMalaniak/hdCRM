import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { Op } from 'sequelize';

import {
  Role,
  User,
  Privilege,
  Asset,
  CollectionApiResponse,
  ApiResponse,
  ItemApiResponse,
  RequestWithBody,
  CollectionQuery,
  RequestWithQuery
} from '../models';

@Service()
export class RoleRoutes {
  private router: Router = Router();

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Role>>) => {
      // Logger.Info(`Geting roles dashboard data...`);
      Role.findAndCountAll({
        attributes: ['keyString', 'id'],
        where: {
          OrganizationId: req.user.OrganizationId
        },
        include: [
          {
            association: Role.associations.Users,
            attributes: ['id'],
            required: true
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

    this.router.post('/', (req: RequestWithBody<Partial<Role>>, res: Response<ItemApiResponse<Role>>) => {
      // Logger.Info(`Creating new role...`);
      Role.create({
        keyString: req.body.keyString,
        OrganizationId: req.user.OrganizationId
      })
        .then((createdRole) => {
          if (req.body.Privileges) {
            const privIds = req.body.Privileges.map((priv) => {
              return {
                id: priv.id
              };
            });

            Privilege.findAll({
              where: {
                [Op.or]: privIds
              }
            })
              .then((privileges) => {
                privileges = privileges.map((privilege) => {
                  privilege.RolePrivilege = req.body.Privileges.find(
                    (reqPriv) => reqPriv.id === privilege.id
                  ).RolePrivilege;
                  return privilege;
                });
                createdRole.setPrivileges(privileges).then(() => {
                  if (req.body.Users) {
                    User.findAll({
                      where: {
                        [Op.or]: req.body.Users as { id: number }[]
                      }
                    })
                      .then((users) => {
                        createdRole
                          .setUsers(users)
                          .then(() => {
                            this.findRoleById(createdRole.id)
                              .then((role) => {
                                return res
                                  .status(StatusCodes.OK)
                                  .json({ success: true, message: 'Role created successfully!', data: role });
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
                      .catch((err: any) => {
                        // Logger.Err(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                      });
                  } else {
                    this.findRoleById(createdRole.id)
                      .then((role) => {
                        return res
                          .status(StatusCodes.OK)
                          .json({ success: true, message: 'Role created successfully!', data: role });
                      })
                      .catch((err: any) => {
                        // Logger.Err(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                      });
                  }
                });
              })
              .catch((err: any) => {
                // Logger.Err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
              });
          } else {
            return res
              .status(StatusCodes.OK)
              .json({ success: true, message: 'Role created successfully!', data: createdRole });
          }
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.get('/', (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Role>>) => {
      // Logger.Info(`Selecting roles list...`);
      const { pageIndex, pageSize, sortDirection, sortIndex } = req.query;
      const limit = parseInt(pageSize);
      const offset = parseInt(pageIndex) * limit;

      Role.findAndCountAll({
        where: {
          OrganizationId: req.user.OrganizationId
        },
        include: [
          {
            model: Privilege,
            through: {
              attributes: ['view', 'edit', 'add', 'delete']
            },
            required: false
          },
          {
            association: Role.associations.Users,
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
              {
                model: Asset,
                as: 'avatar',
                required: false
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
          return res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.get('/:id', (req: Request, res: Response<ItemApiResponse<Role>>) => {
      // Logger.Info(`Selecting Role by roleId: ${req.params.id}...`);
      this.findRoleById(req.params.id)
        .then((role) => {
          return res.status(StatusCodes.OK).json({ success: true, data: role });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.put('/:id', (req: RequestWithBody<Partial<Role>>, res: Response<ItemApiResponse<Role>>) => {
      // Logger.Info(`Updating Role by Id: ${req.body.id}...`);
      Role.update(
        {
          keyString: req.body.keyString
        },
        {
          where: { id: req.body.id }
        }
      )
        .then(() => {
          this.findRoleById(req.body.id)
            .then((role) => {
              if (req.body.Privileges) {
                const privIds = req.body.Privileges.map((priv) => {
                  return {
                    id: priv.id
                  };
                });

                Privilege.findAll({
                  where: {
                    [Op.or]: privIds
                  }
                })
                  .then((privileges) => {
                    privileges = privileges.map((privilege) => {
                      privilege.RolePrivilege = req.body.Privileges.find(
                        (reqPriv) => reqPriv.id === privilege.id
                      ).RolePrivilege;
                      return privilege;
                    });
                    role.setPrivileges(privileges).then(() => {
                      if (req.body.Users) {
                        User.findAll({
                          where: {
                            [Op.or]: req.body.Users as { id: number }[]
                          }
                        })
                          .then((users) => {
                            role
                              .setUsers(users)
                              .then(() => {
                                this.findRoleById(req.body.id)
                                  .then((updatedRole) => {
                                    return res.status(StatusCodes.OK).json({
                                      success: true,
                                      message: 'Role updated successfully!',
                                      data: updatedRole
                                    });
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
                          .catch((err: any) => {
                            // Logger.Err(err);
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                          });
                      } else {
                        this.findRoleById(req.body.id)
                          .then((updatedRole) => {
                            return res
                              .status(StatusCodes.OK)
                              .json({ success: true, message: 'Role updated successfully!', data: updatedRole });
                          })
                          .catch((err: any) => {
                            // Logger.Err(err);
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                          });
                      }
                    });
                  })
                  .catch((err: any) => {
                    // Logger.Err(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                  });
              } else {
                return res
                  .status(StatusCodes.OK)
                  .json({ success: true, message: 'Role updated successfully!', data: role });
              }
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
    });

    this.router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
      // Logger.Info(`Deleting role by id: ${req.params.id}...`);
      Role.destroy({
        where: { id: req.params.id }
      })
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} role` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    return this.router;
  }

  private findRoleById(roleId: number | string): Promise<Role> {
    return Role.findByPk(roleId, {
      include: [
        {
          association: Role.associations.Users,
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: Asset,
              as: 'avatar'
            }
          ]
        },
        {
          model: Privilege,
          through: {
            attributes: ['view', 'edit', 'add', 'delete']
          },
          required: false
        }
      ]
    });
  }
}
