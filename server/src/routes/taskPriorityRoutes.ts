import { Response, Router } from 'express';
import { Service } from 'typedi';

import { TaskController } from '../controllers';
import { CollectionApiResponse, TaskPriority } from '../models';

@Service()
export class TaskPriorityRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', async (req, res: Response<CollectionApiResponse<TaskPriority>>) =>
      this.taskController.getPrioriities(req, res)
    );

    return this.router;
  }
}
