import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';

@Controller('privileges/')
export class PrivilegeController {

    @Post('')
    @Middleware([Passport.authenticate()])
    private create(req: Request, res: Response) {
        Logger.Info(`Creating new privilege...`);
        db.Privilege.create({
            keyString: req.body.keyString
        }).then(() => {
            return res.status(OK);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get('')
    @Middleware([Passport.authenticate()])
    private getList(req: Request, res: Response) {
        Logger.Info(`Selecting privileges list...`);
        db.Privilege.findAll().then(privileges => {
            const privilegesObjNew = privileges.map(privilege => {
                return {
                    id: privilege.id,
                    keyString: privilege.keyString,
                    selected: false
                };
            });
            return res.status(OK).json(privilegesObjNew);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get(':roleId')
    @Middleware([Passport.authenticate()])
    private getListForRole(req: Request, res: Response) {
        Logger.Info(`Selecting privileges list for Role by roleId: ${req.params.roleId}...`);
        db.Privilege.findAll({
            attributes: ['id', 'keyString'],
            include: [{
                model: db.Role,
                where: {id: req.params.roleId},
                required: false
            }]
        }).then(privileges => {
            const privilegesObjNew = privileges.map(privilege => {
                return {
                    id: privilege.id,
                    keyString: privilege.keyString,
                    selected: privilege.Roles.length > 0 ? true : false
                };
            });
            return res.status(OK).json(privilegesObjNew);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get('availableForUser/:userId/')
    @Middleware([Passport.authenticate()])
    private getListForUser(req: Request, res: Response) {
        Logger.Info(`Selecting privileges list for User by userId: ${req.params.userId}...`);
        db.User.findByPk(req.params.userId).then(user => {
            user.getRoles().then(roles => {
                const promises = [];
                roles.forEach(role => {
                    promises.push(
                        role.getPrivileges().then(privileges => {
                            return privileges;
                        })
                    );
                });
                Promise.all(promises).then(result => {
                    let resp = [].concat(...result);
                    resp = [...new Set(resp.map(x => x.keyString))];
                    return res.status(OK).json(resp);
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
    }
}
