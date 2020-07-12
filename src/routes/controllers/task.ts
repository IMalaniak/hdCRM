import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';
import { TaskDBController } from '../../dbControllers/tasksController';

@Controller('tasks/')
export class TaskController {
  private taskDbCtrl: TaskDBController = new TaskDBController();

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response) {
    this.taskDbCtrl
      .getAll(req.user)
      .then(tasks => {
        return res.status(OK).json(tasks);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: Request, res: Response) {
    req.body.CreatorId = req.user.id;

    this.taskDbCtrl
      .create(req.body)
      .then((task: db.Task) => {
        this.taskDbCtrl
          .getById(task.id)
          .then(newTask => {
            return res.status(OK).json(newTask);
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: Request, res: Response) {
    this.taskDbCtrl
      .updateOne(req.body)
      .then(result => {
        if (!!result) {
          this.taskDbCtrl
            .getById(req.body.id)
            .then(task => res.status(OK).json(task))
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(BAD_REQUEST).json(error.toString());
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response) {
    this.taskDbCtrl
      .deleteTask(req.params.id)
      .then(result => {
        return res.status(OK).json(result);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('task-multiple/:taskIds')
  @Middleware([Passport.authenticate()])
  private deleteMultipleSessions(req: Request, res: Response) {
    this.taskDbCtrl
      .deleteTask(req.body.taskIds)
      .then(response => {
        return res.status(OK).json(response);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }
}
