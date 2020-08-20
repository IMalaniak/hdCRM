import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Task } from '../../models';
import Passport from '../../config/passport';
import { TaskDBController } from '../../dbControllers/tasksController';
import { CollectionApiResponse, ApiResponse, ItemApiResponse } from 'src/models/apiResponse';
import { RequestWithBody } from 'src/models/apiRequest';

@Controller('tasks/')
export class TaskController {
  private taskDbCtrl: TaskDBController = new TaskDBController();

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response<CollectionApiResponse<Task>>) {
    this.taskDbCtrl
      .getAll(req.user)
      .then(tasks => {
        return res.status(OK).json({ success: true, data: tasks });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: RequestWithBody<Partial<Task>>, res: Response<ItemApiResponse<Task>>) {
    req.body.CreatorId = req.user.id;

    this.taskDbCtrl
      .create(req.body)
      .then((task: Task) => {
        this.taskDbCtrl
          .getById(task.id)
          .then(newTask => {
            return res.status(OK).json({ success: true, message: 'Task is created successfully!', data: newTask });
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(INTERNAL_SERVER_ERROR).json(err);
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: RequestWithBody<Partial<Task>>, res: Response<ItemApiResponse<Task>>) {
    this.taskDbCtrl
      .updateOne(req.body)
      .then(result => {
        if (!!result) {
          this.taskDbCtrl
            .getById(req.body.id)
            .then(task => res.status(OK).json({ success: true, message: 'Task is updated successfully!', data: task }))
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(INTERNAL_SERVER_ERROR).json(error.toString());
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error.toString());
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response<ApiResponse>) {
    this.taskDbCtrl
      .deleteTask(req.params.id)
      .then(result => {
        return res.status(OK).json({ success: true, message: `Deleted ${result} task` });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error.toString());
      });
  }

  @Put('task-multiple/:taskIds')
  @Middleware([Passport.authenticate()])
  private deleteMultipleTask(req: Request, res: Response<ApiResponse>) {
    this.taskDbCtrl
      .deleteTask(req.body.taskIds)
      .then(result => {
        return res.status(OK).json({ success: true, message: `Deleted ${result} tasks` });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error.toString());
      });
  }
}
