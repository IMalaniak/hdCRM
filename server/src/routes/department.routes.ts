/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { CollectionApiResponse, BaseResponse } from '../models';
import { DepartmentController } from '../controllers';
import { Department, DepartmentAttributes, DepartmentCreationAttributes } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class DepartmentRoutes extends BaseRoutes<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  constructor(protected readonly routesController: DepartmentController) {
    super();
  }

  public register(): Router {
    this.router.get(
      '/dashboard',
      async (req: Request, res: Response<CollectionApiResponse<Department> | BaseResponse>) =>
        this.routesController.getDashboardData(req, res)
    );

    this.buildBaseRouter();
    return this.router;
  }
}
