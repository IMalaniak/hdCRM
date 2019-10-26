import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';
import { Op } from 'sequelize';

@Controller('roles/')
export class RoleController {

    @Get('dashboard')
    @Middleware([Passport.authenticate()])
    private getDashboardData(req: Request, res: Response) {
        Logger.Info(`Geting roles dashboard data...`);
        db.Role.findAndCountAll({
            attributes: ['keyString', 'id'],
            include: [
                {
                    model: db.User,
                    attributes: ['id'],
                    required: true
                }
            ],
            order: [
                ['id', 'ASC']
            ]
        }).then(data => {
            res.status(OK).json({list: data.rows, count: data.count});
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Post('')
    @Middleware([Passport.authenticate()])
    private create(req: Request, res: Response) {
        Logger.Info(`Creating new role...`);
        db.Role.create({
            keyString: req.body.keyString
        }).then(createdRole => {
            this.findRoleById(createdRole.id).then(role => {
                if (req.body.Privileges) {
                    const privIds = req.body.Privileges.map(priv => {
                        return {
                            id: priv.id
                        };
                    });

                    db.Privilege.findAll({
                        where: {
                                [Op.or] : privIds
                        }
                    }).then(privileges => {
                        privileges = privileges.map(privilege => {
                            privilege.RolePrivilege = req.body.Privileges.find(reqPriv => reqPriv.id === privilege.id).RolePrivilege;
                            return privilege;
                        });
                        role.setPrivileges(privileges).then(() => {
                            if (req.body.Users) {
                                db.User.findAll({
                                    where: {
                                            [Op.or] : req.body.Users
                                    }
                                }).then(users => {
                                    role.setUsers(users).then(() => {
                                        this.findRoleById(createdRole.id).then(role => {
                                            return res.status(OK).json(role);
                                        }).catch((err: any) => {
                                            Logger.Err(err);
                                            return res.status(BAD_REQUEST).json(err.toString());
                                        });
                                    }).catch((err: any) => {
                                        Logger.Err(err);
                                        return res.status(BAD_REQUEST).json(err.toString());
                                    });
                                }).catch((err: any) => {
                                    Logger.Err(err);
                                    return res.status(BAD_REQUEST).json(err.toString());
                                });
                            } else {
                                this.findRoleById(createdRole.id).then(role => {
                                    return res.status(OK).json(role);
                                }).catch((err: any) => {
                                    Logger.Err(err);
                                    return res.status(BAD_REQUEST).json(err.toString());
                                });
                            }
                        });
                    }).catch((err: any) => {
                        Logger.Err(err);
                        return res.status(BAD_REQUEST).json(err.toString());
                    });
                } else {
                    return res.status(OK).json(role);
                }
            }).catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err.toString());
            });
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get('')
    @Middleware([Passport.authenticate()])
    private getList(req: Request, res: Response) {
        Logger.Info(`Selecting roles list...`);
        const queryParams = req.query;
        const limit = parseInt(queryParams.pageSize);
        const offset = parseInt(queryParams.pageIndex) * limit;

        db.Role.findAndCountAll({
            include: [
                {
                    model: db.Privilege,
                    through: {
                        attributes: ['view', 'edit', 'add', 'delete']
                    },
                    required: false
                }, {
                    model: db.User,
                    attributes: { exclude: ['passwordHash', 'salt'] },
                    include: [
                        {
                            model: db.Asset,
                            as: 'avatar',
                            required: false
                        }
                    ],
                    required: false
                }
            ],
            limit: limit,
            offset: offset,
            order: [
                [queryParams.sortIndex, queryParams.sortDirection.toUpperCase()]
            ],
            distinct: true
        }).then(data => {
            const pages = Math.ceil(data.count / limit);
            return res.status(OK).json({list: data.rows, count: data.count, pages: pages});
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get(':id')
    @Middleware([Passport.authenticate()])
    private getOne(req: Request, res: Response) {
        Logger.Info(`Selecting Role by roleId: ${req.params.id}...`);
        this.findRoleById(req.params.id).then(role => {
            return res.status(OK).json(role);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Put(':id')
    @Middleware([Passport.authenticate()])
    private updateOne(req: Request, res: Response) {
        Logger.Info(`Updating Role by Id: ${req.body.id}...`);
        db.Role.update(
            {
                keyString: req.body.keyString,
            }, {
                where: {id: req.body.id}
            }
        ).then(() => {
            this.findRoleById(req.body.id).then(role => {
                if (req.body.Privileges) {
                    const privIds = req.body.Privileges.map(priv => {
                        return {
                            id: priv.id
                        };
                    });

                    db.Privilege.findAll({
                        where: {
                                [Op.or] : privIds
                        }
                    }).then(privileges => {
                        privileges = privileges.map(privilege => {
                            privilege.RolePrivilege = req.body.Privileges.find(reqPriv => reqPriv.id === privilege.id).RolePrivilege;
                            return privilege;
                        });
                        role.setPrivileges(privileges).then(() => {
                            if (req.body.Users) {
                                db.User.findAll({
                                    where: {
                                            [Op.or] : req.body.Users
                                    }
                                }).then(users => {
                                    role.setUsers(users).then(result => {
                                        this.findRoleById(req.body.id).then(role => {
                                            return res.status(OK).json(role);
                                        }).catch((err: any) => {
                                            Logger.Err(err);
                                            return res.status(BAD_REQUEST).json(err.toString());
                                        });
                                    }).catch((err: any) => {
                                        Logger.Err(err);
                                        return res.status(BAD_REQUEST).json(err.toString());
                                    });
                                }).catch((err: any) => {
                                    Logger.Err(err);
                                    return res.status(BAD_REQUEST).json(err.toString());
                                });
                            } else {
                                this.findRoleById(req.body.id).then(role => {
                                    return res.status(OK).json(role);
                                }).catch((err: any) => {
                                    Logger.Err(err);
                                    return res.status(BAD_REQUEST).json(err.toString());
                                });
                            }
                        });
                    }).catch((err: any) => {
                        Logger.Err(err);
                        return res.status(BAD_REQUEST).json(err.toString());
                    });
                } else {
                    return res.status(OK).json(role);
                }
            }).catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err.toString());
            });
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Delete(':id')
    @Middleware([Passport.authenticate()])
    private deleteOne(req: Request, res: Response) {
        Logger.Info(`Deleting role by id: ${req.params.id}...`);
        db.Role.destroy({
            where: { id: req.params.id }
        }).then(result => {
            return res.status(OK).json(result);
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    private findRoleById(roleId: number | string): Promise<db.Role> {
        return db.Role.findByPk(roleId, {
            include: [
                {
                    model: db.User,
                    attributes: { exclude: ['passwordHash', 'salt'] },
                    include: [
                        {
                            model: db.Asset,
                            as: 'avatar'
                        }
                    ]
                }, {
                    model: db.Privilege,
                    through: {
                        attributes: ['view', 'edit', 'add', 'delete']
                    },
                    required: false
                }
            ]
        });
    }
}
