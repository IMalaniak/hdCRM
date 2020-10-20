import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { Task, CollectionApiResponse, ApiResponse, ItemApiResponse, RequestWithBody } from '../models';
import { TaskController } from '../controllers';

@Service()
export class TaskRoutes {
  private router: Router = Router();

  constructor(private readonly taskController: TaskController) {}

  public register(): Router {
    this.router.get('/', (req: Request, res: Response<CollectionApiResponse<Task>>) => {
      this.taskController
        .getAll(req.user)
        .then((tasks) => {
          return res.status(StatusCodes.OK).json({ success: true, data: tasks });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.post('/', (req: RequestWithBody<Partial<Task>>, res: Response<ItemApiResponse<Task>>) => {
      req.body.CreatorId = req.user.id;

      this.taskController
        .create(req.body)
        .then((task: Task) => {
          this.taskController
            .getById(task.id)
            .then((newTask) => {
              return res
                .status(StatusCodes.OK)
                .json({ success: true, message: 'Task is created successfully!', data: newTask });
            })
            .catch((err: any) => {
              // Logger.Err(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.put('/:id', (req: RequestWithBody<Partial<Task>>, res: Response<ItemApiResponse<Task>>) => {
      this.taskController
        .updateOne(req.body)
        .then((result) => {
          if (!!result) {
            this.taskController
              .getById(req.body.id)
              .then((task) =>
                res.status(StatusCodes.OK).json({ success: true, message: 'Task is updated successfully!', data: task })
              )
              .catch((error: any) => {
                // Logger.Err(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
              });
          }
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
      this.taskController
        .deleteTask(req.params.id)
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} task` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.put('/task-multiple/:taskIds', (req: Request, res: Response<ApiResponse>) => {
      this.taskController
        .deleteTask(req.body.taskIds)
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} tasks` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    return this.router;
  }
}
