import { Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import { Task, BaseResponse, RequestWithBody, TaskCreationAttributes, TaskAttributes } from '../models';
import { TaskController } from '../controllers';
import { CustomError } from '../errors';

@Service()
export class TaskRoutes extends BaseRoutes<TaskCreationAttributes, TaskAttributes, Task> {
  constructor(protected readonly routesController: TaskController) {
    super();
  }

  public register(): Router {
    this.buildBaseRouter();

    this.router.put(
      '/task-multiple/:taskIds',
      async (req: RequestWithBody<{ taskIds: number[] }>, res: Response<BaseResponse | CustomError>) =>
        this.routesController.deleteMultiple(req, res)
    );

    return this.router;
  }
}
