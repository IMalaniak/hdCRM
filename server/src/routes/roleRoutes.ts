import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { RoleController } from '../controllers';

import { BaseRoutes } from './base/baseRoutes';
import { Role, CollectionApiResponse, RoleCreationAttributes, RoleAttributes } from '../models';
import { CustomError } from '../errors';

@Service()
export class RoleRoutes extends BaseRoutes<RoleCreationAttributes, RoleAttributes, Role> {
  constructor(protected readonly routesController: RoleController) {
    super();
  }

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Role> | CustomError>) =>
      this.routesController.getDashboardData(req, res)
    );

    this.buildBaseRouter();

    return this.router;
  }
}
