import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import {
  Plan,
  Asset,
  BaseResponse,
  ItemApiResponse,
  RequestWithQuery,
  PlanCreationAttributes,
  PlanAttributes
} from '../models';
import uploads from '../multer/multerConfig';
import { PlanController } from '../controllers';

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
