import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';

@Controller('users/')
export class UserController {

    @Get(':id')
    private get(req: Request, res: Response) {
        Logger.Info(`Selecting user by id: ${req.params.id}...`);
        db.User.findByPk(req.params.id).then((user: db.User) => {
            return res.status(OK).json(user);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
        });
    }

    @Get('')
    private getAll(req: Request, res: Response) {
        Logger.Info(`Selecting all users...`);
        db.User.findAll().then((users: db.User[]) => {
            return res.status(OK).json(users);
        }).catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
        });
    }

    @Post('')
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
    private updateOne(req: Request, res: Response) {
        Logger.Info(`Updating user by id: ${req.params.id}...`);
    }

    @Delete(':id')
    private deleteOne(req: Request, res: Response) {
        Logger.Info(`Deleting user by id: ${req.params.id}...`);
    }
}
