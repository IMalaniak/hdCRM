import { Response, Router } from 'express';
import { Service } from 'typedi';

import { TaskController } from '../controllers';
import { BaseResponse, CollectionApiResponse } from '../models';
import { TaskPriority } from '../repositories/TaskPriority';

@Service()
export class TaskPriorityRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', async (req, res: Response<CollectionApiResponse<TaskPriority> | BaseResponse>) =>
      this.taskController.getPriorities(req, res)
    );

    return this.router;
  }
}
