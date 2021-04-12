/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { RoleController } from '../controllers';
import { CollectionApiResponse, BaseResponse } from '../models';
import { RoleCreationAttributes, RoleAttributes, Role } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class RoleRoutes extends BaseRoutes<RoleCreationAttributes, RoleAttributes, Role> {
  constructor(protected readonly routesController: RoleController) {
    super();
  }

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Role> | BaseResponse>) =>
      this.routesController.getDashboardData(req, res)
    );

    this.buildBaseRouter();

    return this.router;
  }
}
