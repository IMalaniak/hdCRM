import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import Passport from '../../config/passport';
import { TaskDBController } from '../../dbControllers/tasksController';

@Controller('task-priorities/')
export class TaskPriorityController {
  private taskDbCtrl: TaskDBController = new TaskDBController();

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response) {
    this.taskDbCtrl
      .getPrioriities()
      .then(priorities => {
        return res.status(OK).json(priorities);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }
}
