import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';

@Controller('stages/')
export class StageController {

    @Post('')
    @Middleware([Passport.authenticate()])
    private create(req: Request, res: Response) {
        Logger.Info(`Creating new stage...`);
        db.Stage.create({
            keyString: req.body.keyString,
        }).then(stage => {
            return res.status(OK).json(stage);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }

    @Get('')
    @Middleware([Passport.authenticate()])
    private getList(req: Request, res: Response) {
        Logger.Info(`Selecting stages list...`);
        db.Stage.findAndCountAll({
            include: [
                {
                    model: db.Plan,
                    attributes: ['id']
                }
            ]
        }).then(data => {
            return res.status(OK).json({list: data.rows, count: data.count});
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
        });
    }
}
