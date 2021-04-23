/* eslint-disable @typescript-eslint/no-misused-promises */
import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { CollectionApiResponse, BaseResponse, ItemApiResponse, RequestWithBody, PasswordReset } from '../models';
import { UserController } from '../controllers';
import { UserCreationAttributes, UserAttributes, User, OrganizationAttributes, Organization } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class UserRoutes extends BaseRoutes<UserCreationAttributes, UserAttributes, User> {
  constructor(protected readonly routesController: UserController) {
    super();
  }

  public register(): Router {
    this.router.get('/profile/', (req: Request, res: Response<ItemApiResponse<User> | BaseResponse>) => {
      req.log.info(`Geting user profile...`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return res.status(StatusCodes.OK).json({ data: req.user! });
    });

    this.router.put(
      '/profile/',
      async (req: RequestWithBody<User>, res: Response<ItemApiResponse<User> | BaseResponse>) =>
        this.routesController.update(req, res)
    );

    this.router.post('/change-password', async (req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>) =>
      this.routesController.updatePassword(req, res)
    );

    this.router.post(
      '/invite',
      async (req: RequestWithBody<UserAttributes[]>, res: Response<CollectionApiResponse<User> | BaseResponse>) =>
        this.routesController.inviteMultiple(req, res)
    );

    this.router.delete('/session/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.routesController.removeSession(req, res)
    );

    this.router.put(
      '/session-multiple/:sessionIds',
      async (req: RequestWithBody<{ sessionIds: number[] }>, res: Response<BaseResponse>) =>
        this.routesController.removeSessionMultiple(req, res)
    );

    this.router.put(
      '/org/:id',
      async (
        req: RequestWithBody<OrganizationAttributes>,
        res: Response<ItemApiResponse<Organization> | BaseResponse>
      ) => this.routesController.updateOrg(req, res)
    );

    this.buildBaseRouter();
    return this.router;
  }
}
