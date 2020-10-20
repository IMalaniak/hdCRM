import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { TaskController } from '../controllers';
import { CollectionApiResponse, TaskPriority } from '../models';

@Service()
export class TaskPriorityRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', (_, res: Response<CollectionApiResponse<TaskPriority>>) => {
      this.taskController
        .getPrioriities()
        .then((priorities) => {
          return res.status(StatusCodes.OK).json({ success: true, data: priorities, resultsNum: priorities.length });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    return this.router;
  }
}
