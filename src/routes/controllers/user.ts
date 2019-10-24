import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import { Op } from 'sequelize';
import Passport from '../../config/passport';
import uploads from '../../multer/multerConfig';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jimp from 'jimp';

@Controller('users/')
export class UserController {

    unlinkAsync = promisify(fs.unlink);

    @Get(':id')
    @Middleware([Passport.authenticate()])
    private get(req: Request, res: Response) {
        Logger.Info(`Selecting user by id: ${req.params.id}...`);
        this.findUserById(req.params.id).then((user: db.User) => {
            return res.status(OK).json(user);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get('')
    @Middleware([Passport.authenticate()])
    private getAll(req: Request, res: Response) {
        Logger.Info(`Selecting all users...`);
        const queryParams = req.query;
        const limit = parseInt(queryParams.pageSize);
        const offset = parseInt(queryParams.pageIndex) * limit;

        db.User.findAndCountAll({
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
                {
                    model: db.Role,
                    through: {
                        attributes: []
                    }
                }, {
                    model: db.UserLoginHistory
                }, {
                    model: db.State
                }, {
                    model: db.Asset
                }, {
                    model: db.Asset,
                    as: 'avatar'
                }, {
                    model: db.Department,
                    required: false,
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
            return res.status(OK).json({ list: data.rows, count: data.count, pages: pages });
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Post('')
    @Middleware([Passport.authenticate()])
    private create(req: Request, res: Response) {
        Logger.Info(`Creating new user...`);
        db.User.create(req.body).then((user: db.User) => {
            return res.status(OK).json(user);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
        });
    }

    @Put(':id')
    @Middleware([Passport.authenticate()])
    private updateOne(req: Request, res: Response) {
        Logger.Info(`Updating user by id: ${req.params.id}...`);
        db.User.update(
            {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                phone: req.body.phone,
                defaultLang: req.body.defaultLang,
                StateId: req.body.StateId
            },
            {
                where: { id: req.body.id }
            }
        ).then(result => {
            if (result) {
                this.findUserById(req.body.id).then(user => {
                    if (req.body.Roles) {
                        db.Role.findAll({
                            where: {
                                [Op.or]: req.body.Roles
                            }
                        }).then(roles => {
                            user.setRoles(roles).then(() => {
                                this.findUserById(req.body.id).then(user => {
                                    return res.status(OK).json(user);
                                }).catch((error: any) => {
                                    Logger.Err(error);
                                    return res.status(BAD_REQUEST).json(error.toString());
                                });
                            });
                        }).catch((error: any) => {
                            Logger.Err(error);
                            return res.status(BAD_REQUEST).json(error.toString());
                        });
                    } else {
                        return res.status(OK).json(user);
                    }
                }).catch((error: any) => {
                    Logger.Err(error);
                    return res.status(BAD_REQUEST).json(error.toString());
                });
            }
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Get('profile')
    @Middleware([Passport.authenticate()])
    private getProfile(req: Request, res: Response) {
        Logger.Info(`Geting user profile...`);
        return res.json(req.user);
    }

    @Post(':id/avatar')
    @Middleware([Passport.authenticate(), uploads.single('profile-pic-uploader')])
    private setUserAvatar(req: Request, res: Response) {
        if (req.file) {
            jimp.read(req.file.path).then(tpl => (tpl.clone().resize(100, jimp.AUTO).write(req.file.destination + '/thumbnails/' + req.file.originalname)));
        }
        db.User.findByPk(req.params.id).then(user => {
            user.getAvatar().then(avatar => {
                if (avatar) {
                    db.Asset.destroy({
                        where: { id: avatar.id }
                    }).then(() => {
                        const uploads = path.join(__dirname, '../../../uploads');
                        const destination = uploads + avatar.location + '/' + avatar.title;
                        const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
                        this.unlinkAsync(destination).then(() => {
                            this.unlinkAsync(thumbDestination).then(() => {
                                const av = {
                                    title: req.file.originalname,
                                    location: req.file.destination.split('uploads')[1],
                                    type: req.file.mimetype
                                };
                                user.createAvatar(av).then(newAv => {
                                    return res.status(OK).json(newAv);
                                }).catch((error: any) => {
                                    Logger.Err(error);
                                    return res.status(BAD_REQUEST).json(error.toString());
                                });
                            }).catch((error: any) => {
                                Logger.Err(error);
                                return res.status(BAD_REQUEST).json(error.toString());
                            });
                        }).catch((error: any) => {
                            Logger.Err(error);
                            return res.status(BAD_REQUEST).json(error.toString());
                        });
                    }).catch((error: any) => {
                        Logger.Err(error);
                        return res.status(BAD_REQUEST).json(error.toString());
                    });
                } else {
                    const av = {
                        title: req.file.originalname,
                        location: req.file.destination.split('uploads')[1],
                        type: req.file.mimetype
                    };
                    user.createAvatar(av).then(newAv => {
                        return res.status(OK).json(newAv);
                    }).catch((error: any) => {
                        Logger.Err(error);
                        return res.status(BAD_REQUEST).json(error.toString());
                    });
                }

            }).catch((error: any) => {
                Logger.Err(error);
                return res.status(BAD_REQUEST).json(error.toString());
            });
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Delete(':id/avatar')
    @Middleware([Passport.authenticate()])
    private deleteUserAvatar(req: Request, res: Response) {
        db.User.findByPk(req.params.id).then(user => {
            user.getAvatar().then(avatar => {
                if (avatar) {
                    db.Asset.destroy({
                        where: { id: avatar.id }
                    }).then(() => {
                        const uploads = path.join(__dirname, '../../../uploads');
                        const destination = uploads + avatar.location + '/' + avatar.title;
                        const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
                        this.unlinkAsync(destination).then(() => {
                            this.unlinkAsync(thumbDestination).then(() => {
                                return res.status(OK).json({ success: true, message: 'avatar deleted' });
                            }).catch((error: any) => {
                                Logger.Err(error);
                                return res.status(BAD_REQUEST).json(error.toString());
                            });
                        }).catch((error: any) => {
                            Logger.Err(error);
                            return res.status(BAD_REQUEST).json(error.toString());
                        });
                    }).catch((error: any) => {
                        Logger.Err(error);
                        return res.status(BAD_REQUEST).json(error.toString());
                    });
                }
            }).catch((error: any) => {
                Logger.Err(error);
                return res.status(BAD_REQUEST).json(error.toString());
            });
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Put('updateUserState')
    @Middleware([Passport.authenticate()])
    private updateUserState(req: Request, res: Response) {
        Logger.Info(`Updating user state by id: ${req.params.id}...`);
        db.User.update(
            {
                StateId: req.body.StateId
            },
            {
                where: { id: req.body.id }
            }
        ).then(result => {
            if (result) {
                this.findUserById(req.body.id).then(user => {
                    return res.status(OK).json(user);
                }).catch((error: any) => {
                    Logger.Err(error);
                    return res.status(BAD_REQUEST).json(error.toString());
                });
            }
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Put('changeStateOfSelected')
    @Middleware([Passport.authenticate()])
    private changeStateOfSelected(req: Request, res: Response) {
        Logger.Info(`Changing state of selected users...`);
        function updateRow(userId: number) {
            return db.User.update(
                {
                    StateId: req.body.stateId
                },
                {
                    where: { id: userId }
                }
            );
        }

        const promises = [];
        req.body.userIds.forEach(userId => {
            promises.push(updateRow(userId));
        });

        return Promise.all(promises).then(result => {
            return res.status(OK).json({ status: 'ok' });
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    @Delete(':id')
    @Middleware([Passport.authenticate()])
    private deleteOne(req: Request, res: Response) {
        Logger.Info(`Deleting user by id: ${req.params.id}...`);
        db.User.destroy({
            where: { id: req.params.id }
        }).then(result => {
            return res.status(OK).json(result);
        }).catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
        });
    }

    private findUserById(userId: number | string): Promise<db.User> {
        return db.User.findByPk(userId, {
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
                {
                    model: db.Role,
                    through: {
                        attributes: []
                    }
                }, {
                    model: db.UserLoginHistory
                }, {
                    model: db.State
                }, {
                    model: db.Asset
                }, {
                    model: db.Asset,
                    as: 'avatar'
                }, {
                    model: db.Department,
                    required: false,
                }
            ]
        });
    }
}
