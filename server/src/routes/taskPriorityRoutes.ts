import { Response, Router } from 'express';
import { Service } from 'typedi';

import { TaskController } from '../controllers';
import { CustomError } from '../errors';
import { CollectionApiResponse, TaskPriority } from '../models';

@Service()
export class TaskPriorityRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', async (req, res: Response<CollectionApiResponse<TaskPriority> | CustomError>) =>
      this.taskController.getPriorities(req, res)
    );

    return this.router;
  }
}
