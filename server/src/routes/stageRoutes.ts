import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { Stage, RequestWithBody, CollectionApiResponse, ItemApiResponse, StageCreationAttributes } from '../models';
import { StageController } from '../controllers';

@Service()
export class StageRoutes {
  private router: Router = Router();

  constructor(private readonly stageController: StageController) {}

  public register(): Router {
    this.router.post(
      '/',
      async (req: RequestWithBody<StageCreationAttributes>, res: Response<ItemApiResponse<Stage>>) =>
        this.stageController.create(req, res)
    );

    this.router.get('/', (req: Request, res: Response<CollectionApiResponse<Stage>>) =>
      this.stageController.getAll(req, res)
    );

    return this.router;
  }
}
