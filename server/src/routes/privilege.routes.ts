/* eslint-disable @typescript-eslint/no-misused-promises */
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { RequestWithBody, CollectionApiResponse, ItemApiResponse, BaseResponse } from '../models';
import { PrivilegeController } from '../controllers';
import { PrivilegeCreationAttributes, Privilege } from '../repositories';

@Service()
export class PrivilegeRoutes {
  private readonly router: Router = Router();

  constructor(private readonly privilegeController: PrivilegeController) {}

  public register(): Router {
    this.router.post(
      '/',
      async (
        req: RequestWithBody<PrivilegeCreationAttributes>,
        res: Response<ItemApiResponse<Privilege> | BaseResponse>
      ) => this.privilegeController.create(req, res)
    );

    this.router.get('/', async (req, res: Response<CollectionApiResponse<Privilege> | BaseResponse>) =>
      this.privilegeController.getAll(req, res)
    );

    return this.router;
  }
}
