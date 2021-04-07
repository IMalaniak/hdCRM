import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import {
  User,
  Organization,
  Asset,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithBody,
  UserCreationAttributes,
  UserAttributes,
  OrganizationAttributes,
  PasswordReset
} from '../models';
import { UserController } from '../controllers';
import uploads from '../multer/multerConfig';
import { CustomError } from '../errors';

@Service()
export class UserRoutes extends BaseRoutes<UserCreationAttributes, UserAttributes, User> {
  constructor(protected readonly routesController: UserController) {
    super();
  }

  public register(): Router {
    this.buildBaseRouter();

    this.router.get('/profile/', (req: Request, res: Response<ItemApiResponse<User> | CustomError>) => {
      req.log.info(`Geting user profile...`);
      return res.status(StatusCodes.OK).json({ data: req.user });
    });

    this.router.put(
      '/profile/',
      async (req: RequestWithBody<User>, res: Response<ItemApiResponse<User> | CustomError>) =>
        this.routesController.update(req, res)
    );

    this.router.post(
      '/change-password',
      async (req: RequestWithBody<PasswordReset>, res: Response<BaseResponse | CustomError>) =>
        this.routesController.updatePassword(req, res)
    );

    this.router.post(
      '/:id/avatar',
      uploads.single('profile-pic-uploader'),
      async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Asset> | CustomError>) =>
        this.routesController.updateAvatar(req, res)
    );

    this.router.delete('/:id/avatar', async (req: Request<{ id: string }>, res: Response<BaseResponse | CustomError>) =>
      this.routesController.deleteAvatar(req, res)
    );

    this.router.post(
      '/invite',
      async (req: RequestWithBody<UserAttributes[]>, res: Response<CollectionApiResponse<User> | CustomError>) =>
        this.routesController.inviteMultiple(req, res)
    );

    this.router.delete(
      '/session/:id',
      async (req: Request<{ id: string }>, res: Response<BaseResponse | CustomError>) =>
        this.routesController.removeSession(req, res)
    );

    this.router.put(
      '/session-multiple/:sessionIds',
      async (req: RequestWithBody<{ sessionIds: number[] }>, res: Response<BaseResponse | CustomError>) =>
        this.routesController.removeSessionMultiple(req, res)
    );

    this.router.put(
      '/org/:id',
      async (
        req: RequestWithBody<OrganizationAttributes>,
        res: Response<ItemApiResponse<Organization> | CustomError>
      ) => this.routesController.updateOrg(req, res)
    );

    return this.router;
  }
}
