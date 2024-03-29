/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseResponse, ItemApiResponse, RequestWithQuery } from '../models';
import { uploads } from '../utils/multerConfig';
import { PlanController } from '../controllers';
import { PlanCreationAttributes, PlanAttributes, Plan, Asset } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class PlanRoutes extends BaseRoutes<PlanCreationAttributes, PlanAttributes, Plan> {
  constructor(protected readonly routesController: PlanController) {
    super();
  }

  public register(): Router {
    this.buildBaseRouter();

    this.router.post(
      '/documents/:planId',
      uploads.single('uploader'),
      // we use single because filepond send file by one
      async (req: Request<{ planId: string }>, res: Response<ItemApiResponse<Asset> | BaseResponse>) =>
        this.routesController.addDocument(req, res)
    );

    this.router.delete(
      '/documents',
      async (req: RequestWithQuery<{ planId: string; docId: string }>, res: Response<BaseResponse>) =>
        this.routesController.deleteDocument(req, res)
    );

    return this.router;
  }
}
