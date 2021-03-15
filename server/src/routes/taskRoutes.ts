import { Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import { Task, BaseResponse, RequestWithBody, TaskCreationAttributes, TaskAttributes } from '../models';
import { TaskController } from '../controllers';

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
