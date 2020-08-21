import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { State } from '../../models';
import Passport from '../../config/passport';
import { RequestWithBody } from 'src/models/apiRequest';
import { CollectionApiResponse, ItemApiResponse } from 'src/models/apiResponse';

@Controller('states/')
export class StateController {
  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: RequestWithBody<Partial<State>>, res: Response<ItemApiResponse<State>>) {
    Logger.Info(`Creating new state...`);
    State.create({
      ...req.body
    })
      .then(state => {
        return res.status(OK).json({ success: true, message: 'State is created successfully!', data: state });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json({ success: false, message: 'There are some missing params!', data: null });
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(_: Request, res: Response<CollectionApiResponse<State>>) {
    Logger.Info(`Selecting states list...`);
    State.findAll()
      .then(states => {
        res.status(OK).json({ success: true, data: states });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err.toString());
      });
  }
}
