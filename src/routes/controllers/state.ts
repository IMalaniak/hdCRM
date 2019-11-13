import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';

@Controller('states/')
export class StateController {
  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: Request, res: Response) {
    Logger.Info(`Creating new state...`);
    db.State.create({
      keyString: req.body.keyString
    })
      .then(state => {
        return res.status(OK).json(state);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(req: Request, res: Response) {
    Logger.Info(`Selecting states list...`);
    db.State.findAll()
      .then(states => {
        res.json(states);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }
}
