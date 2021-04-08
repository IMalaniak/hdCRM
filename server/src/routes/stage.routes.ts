import { Service } from 'typedi';
import { Router, Request, Response } from 'express';

import { BaseRoutes } from './base/base.routes';
import { StageController } from '../controllers';
import { StageCreationAttributes, StageAttributes, Stage } from '../repositories';
import { BaseResponse, CollectionApiResponse } from '../models';

@Service()
export class StageRoutes extends BaseRoutes<StageCreationAttributes, StageAttributes, Stage> {
  constructor(protected readonly routesController: StageController) {
    super();
  }

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Stage> | BaseResponse>) =>
      this.routesController.getAll(req, res)
    );

    this.buildBaseRouter();

    return this.router;
  }
}
