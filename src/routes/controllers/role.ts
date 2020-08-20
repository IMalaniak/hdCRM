import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Role, User, Privilege, Asset } from '../../models';
import Passport from '../../config/passport';
import { Op } from 'sequelize';
import { CollectionApiResponse, ApiResponse, ItemApiResponse } from '../../models/apiResponse';
import { RequestWithBody, CollectionQuery, RequestWithQuery } from 'src/models/apiRequest';

@Controller('roles/')
export class RoleController {
  @Get('dashboard')
  @Middleware([Passport.authenticate()])
  private getDashboardData(req: Request, res: Response<CollectionApiResponse<Role>>) {
    Logger.Info(`Geting roles dashboard data...`);
    Role.findAndCountAll({
      attributes: ['keyString', 'id'],
      where: {
        OrganizationId: req.user.OrganizationId
      },
      include: [
        {
          model: User,
          attributes: ['id'],
          required: true
        }
      ],
      order: [['id', 'ASC']]
    })
      .then(data => {
        res.status(OK).json({ success: true, data: data.rows, resultsNum: data.count });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: RequestWithBody<Partial<Role>>, res: Response<ItemApiResponse<Role>>) {
    Logger.Info(`Creating new role...`);
    Role.create({
      keyString: req.body.keyString,
      OrganizationId: req.user.OrganizationId
    })
      .then(createdRole => {
        this.findRoleById(createdRole.id)
          .then(role => {
            if (req.body.Privileges) {
              const privIds = req.body.Privileges.map(priv => {
                return {
                  id: priv.id
                };
              });

              Privilege.findAll({
                where: {
                  [Op.or]: privIds
                }
              })
                .then(privileges => {
                  privileges = privileges.map(privilege => {
                    privilege.RolePrivilege = req.body.Privileges.find(
                      reqPriv => reqPriv.id === privilege.id
                    ).RolePrivilege;
                    return privilege;
                  });
                  role.setPrivileges(privileges).then(() => {
                    if (req.body.Users) {
                      User.findAll({
                        where: {
                          [Op.or]: req.body.Users as Array<{ id: number }>
                        }
                      })
                        .then(users => {
                          role
                            .setUsers(users)
                            .then(() => {
                              this.findRoleById(createdRole.id)
                                .then(role => {
                                  return res
                                    .status(OK)
                                    .json({ success: true, message: 'Role created successfully!', data: role });
                                })
                                .catch((err: any) => {
                                  Logger.Err(err);
                                  return res.status(INTERNAL_SERVER_ERROR).json(err);
                                });
                            })
                            .catch((err: any) => {
                              Logger.Err(err);
                              return res.status(INTERNAL_SERVER_ERROR).json(err);
                            });
                        })
                        .catch((err: any) => {
                          Logger.Err(err);
                          return res.status(INTERNAL_SERVER_ERROR).json(err);
                        });
                    } else {
                      this.findRoleById(createdRole.id)
                        .then(role => {
                          return res
                            .status(OK)
                            .json({ success: true, message: 'Role created successfully!', data: role });
                        })
                        .catch((err: any) => {
                          Logger.Err(err);
                          return res.status(INTERNAL_SERVER_ERROR).json(err);
                        });
                    }
                  });
                })
                .catch((err: any) => {
                  Logger.Err(err);
                  return res.status(INTERNAL_SERVER_ERROR).json(err);
                });
            } else {
              return res.status(OK).json({ success: true, message: 'Role created successfully!', data: role });
            }
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(INTERNAL_SERVER_ERROR).json(err);
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Role>>) {
    Logger.Info(`Selecting roles list...`);
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
          model: User,
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
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        return res.status(OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Get(':id')
  @Middleware([Passport.authenticate()])
  private getOne(req: Request, res: Response<ItemApiResponse<Role>>) {
    Logger.Info(`Selecting Role by roleId: ${req.params.id}...`);
    this.findRoleById(req.params.id)
      .then(role => {
        return res.status(OK).json({ success: true, data: role });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: RequestWithBody<Partial<Role>>, res: Response<ItemApiResponse<Role>>) {
    Logger.Info(`Updating Role by Id: ${req.body.id}...`);
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
          .then(role => {
            if (req.body.Privileges) {
              const privIds = req.body.Privileges.map(priv => {
                return {
                  id: priv.id
                };
              });

              Privilege.findAll({
                where: {
                  [Op.or]: privIds
                }
              })
                .then(privileges => {
                  privileges = privileges.map(privilege => {
                    privilege.RolePrivilege = req.body.Privileges.find(
                      reqPriv => reqPriv.id === privilege.id
                    ).RolePrivilege;
                    return privilege;
                  });
                  role.setPrivileges(privileges).then(() => {
                    if (req.body.Users) {
                      User.findAll({
                        where: {
                          [Op.or]: req.body.Users as Array<{ id: number }>
                        }
                      })
                        .then(users => {
                          role
                            .setUsers(users)
                            .then(result => {
                              this.findRoleById(req.body.id)
                                .then(role => {
                                  return res
                                    .status(OK)
                                    .json({ success: true, message: 'Role updated successfully!', data: role });
                                })
                                .catch((err: any) => {
                                  Logger.Err(err);
                                  return res.status(INTERNAL_SERVER_ERROR).json(err);
                                });
                            })
                            .catch((err: any) => {
                              Logger.Err(err);
                              return res.status(INTERNAL_SERVER_ERROR).json(err);
                            });
                        })
                        .catch((err: any) => {
                          Logger.Err(err);
                          return res.status(INTERNAL_SERVER_ERROR).json(err);
                        });
                    } else {
                      this.findRoleById(req.body.id)
                        .then(role => {
                          return res
                            .status(OK)
                            .json({ success: true, message: 'Role updated successfully!', data: role });
                        })
                        .catch((err: any) => {
                          Logger.Err(err);
                          return res.status(INTERNAL_SERVER_ERROR).json(err);
                        });
                    }
                  });
                })
                .catch((err: any) => {
                  Logger.Err(err);
                  return res.status(INTERNAL_SERVER_ERROR).json(err);
                });
            } else {
              return res.status(OK).json({ success: true, message: 'Role updated successfully!', data: role });
            }
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(INTERNAL_SERVER_ERROR).json(err);
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response<ApiResponse>) {
    Logger.Info(`Deleting role by id: ${req.params.id}...`);
    Role.destroy({
      where: { id: req.params.id }
    })
      .then(result => {
        return res.status(OK).json({ success: true, message: `Deleted ${result} role` });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  private findRoleById(roleId: number | string): Promise<Role> {
    return Role.findByPk(roleId, {
      include: [
        {
          model: User,
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
