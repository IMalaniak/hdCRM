import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Privilege } from '../../models';
import Passport from '../../config/passport';
import { RequestWithBody } from '../../models/apiRequest';
import { CollectionApiResponse, ItemApiResponse } from '../../models/apiResponse';

@Controller('privileges/')
export class PrivilegeController {
  @Post('')
  @Middleware([Passport.authenticate()])
  create(req: RequestWithBody<Partial<Privilege>>, res: Response<ItemApiResponse<Privilege>>) {
    Logger.Info(`Creating new privilege...`);
    Privilege.create({
      keyString: req.body.keyString,
      title: req.body.title
    })
      .then((privilege) => {
        return res.status(OK).json({ success: true, message: 'Privilege is created successfully!', data: privilege });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json({ success: false, message: 'There are some missing params!', data: null });
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  getList(_, res: Response<CollectionApiResponse<Privilege>>) {
    Logger.Info(`Selecting privileges list...`);
    Privilege.findAndCountAll()
      .then((data) => {
        return res.status(OK).json({ success: true, data: data.rows, resultsNum: data.count });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }
}
