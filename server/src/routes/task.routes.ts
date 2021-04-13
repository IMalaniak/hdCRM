/* eslint-disable @typescript-eslint/no-misused-promises */
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { TaskController } from '../controllers';
import { RequestWithBody, BaseResponse } from '../models';
import { TaskCreationAttributes, TaskAttributes, Task } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class TaskRoutes extends BaseRoutes<TaskCreationAttributes, TaskAttributes, Task> {
  constructor(protected readonly routesController: TaskController) {
    super();
  }

  public register(): Router {
    this.buildBaseRouter();

    this.router.put(
      '/task-multiple/:taskIds',
      async (req: RequestWithBody<{ taskIds: number[] }>, res: Response<BaseResponse>) =>
        this.routesController.deleteMultiple(req, res)
    );

    return this.router;
  }
}
