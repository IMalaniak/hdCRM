import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import {
  Task,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithBody,
  TaskCreationAttributes
} from '../models';
import { TaskController } from '../controllers';

@Service()
export class TaskRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', async (req: Request, res: Response<CollectionApiResponse<Task>>) =>
      this.taskController.getAll(req, res)
    );

    this.router.post('/', async (req: RequestWithBody<TaskCreationAttributes>, res: Response<ItemApiResponse<Task>>) =>
      this.taskController.create(req, res)
    );

    this.router.put('/:id', async (req: RequestWithBody<Task>, res: Response<ItemApiResponse<Task>>) =>
      this.taskController.updateOne(req, res)
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.taskController.delete(req, res)
    );

    this.router.put(
      '/task-multiple/:taskIds',
      async (req: RequestWithBody<{ taskIds: number[] }>, res: Response<BaseResponse>) =>
        this.taskController.deleteMultiple(req, res)
    );

    return this.router;
  }
}
