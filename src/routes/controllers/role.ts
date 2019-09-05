import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';
import { Op } from 'sequelize';

@Controller('roles/')
export class RoleController {

    @Post('')
    @Middleware([Passport.authenticate()])
    private create(req: Request, res: Response) {
        Logger.Info(`Creating new role...`);
        db.Role.create({
            keyString: req.body.keyString
        }).then(role => {
            if (req.body.Privileges) {
                db.Privilege.findAll({
                    where: {
                        [Op.or] : req.body.Privileges
                    }
                }).then(privileges => {
                    role.setPrivileges(privileges).then(result => {
                        if (req.body.Users) {
                            db.User.findAll({
                                where: {
                                        [Op.or] : req.body.Users
                                }
                            }).then(users => {
                                role.setUsers(users).then(result => {
                                    return res.status(OK).json(result);
                                }).catch((err: any) => {
                                    Logger.Err(err);
                                    return res.status(BAD_REQUEST).json(err.toString());
                                });
                            }).catch((err: any) => {
                                Logger.Err(err);
                                return res.status(BAD_REQUEST).json(err.toString());
                            });
                        } else {
                            return res.status(OK).json(result);
                        }
                    }).catch((err: any) => {
                        Logger.Err(err);
                        return res.status(BAD_REQUEST).json(err.toString());
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
                        attributes: []
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

    @Put('')
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
                        db.Privilege.findAll({
                            where: {
                                    [Op.or] : req.body.Privileges
                            }
                        }).then(privileges => {
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
                        attributes: []
                    }
                }
            ]
        });
    }
}
