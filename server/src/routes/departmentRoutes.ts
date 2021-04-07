import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import { Department, CollectionApiResponse, DepartmentCreationAttributes, DepartmentAttributes } from '../models';
import { DepartmentController } from '../controllers';
import { CustomError } from '../errors';

@Service()
export class DepartmentRoutes extends BaseRoutes<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  constructor(protected readonly routesController: DepartmentController) {
    super();
  }

  public register(): Router {
    this.router.get(
      '/dashboard',
      async (req: Request, res: Response<CollectionApiResponse<Department> | CustomError>) =>
        this.routesController.getDashboardData(req, res)
    );

    this.buildBaseRouter();
    return this.router;
  }
}
