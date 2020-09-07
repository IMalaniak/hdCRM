import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Plan, Stage } from '../../models';
import Passport from '../../config/passport';
import { RequestWithBody } from '../../models/apiRequest';
import { CollectionApiResponse, ItemApiResponse } from '../../models/apiResponse';

@Controller('stages/')
export class StageController {
  @Post('')
  @Middleware([Passport.authenticate()])
  create(req: RequestWithBody<Partial<Stage>>, res: Response<ItemApiResponse<Stage>>) {
    Logger.Info(`Creating new stage...`);
    Stage.create({
      ...req.body
    })
      .then((stage) => {
        return res.status(OK).json({ success: true, message: 'Stage created successfull!', data: stage });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json({ success: false, message: 'There are some missing params!', data: null });
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  getList(req: Request, res: Response<CollectionApiResponse<Stage>>) {
    Logger.Info(`Selecting stages list...`);
    Stage.findAndCountAll({
      include: [
        {
          model: Plan,
          where: {
            OrganizationId: req.user.OrganizationId
          },
          attributes: ['id']
        }
      ]
    })
      .then((data) => {
        return res.status(OK).json({ success: true, data: data.rows, resultsNum: data.count });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err.toString());
      });
  }
}
