import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import Passport from '../../config/passport';
import { TaskDBController } from '../../dbControllers/tasksController';
import { CollectionApiResponse } from '../../models/apiResponse';
import { TaskPriority } from '../../models';

@Controller('task-priorities/')
export class TaskPriorityController {
  private taskDbCtrl: TaskDBController = new TaskDBController();

  @Get('')
  @Middleware([Passport.authenticate()])
  getAll(_, res: Response<CollectionApiResponse<TaskPriority>>) {
    this.taskDbCtrl
      .getPrioriities()
      .then((priorities) => {
        return res.status(OK).json({ success: true, data: priorities, resultsNum: priorities.length });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }
}
