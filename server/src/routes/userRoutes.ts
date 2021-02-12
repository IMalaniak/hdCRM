import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import {
  User,
  Organization,
  Asset,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithQuery,
  CollectionQuery,
  RequestWithBody,
  UserCreationAttributes,
  UserAttributes,
  OrganizationAttributes,
  PasswordReset
} from '../models';
import { UserController } from '../controllers';
import uploads from '../multer/multerConfig';

@Service()
export class UserRoutes {
  private router: Router = Router();

  constructor(private readonly userController: UserController) {}

  public register(): Router {
    this.router.get('/profile/', (req: Request, res: Response<ItemApiResponse<User>>) => {
      req.log.info(`Geting user profile...`);
      return res.status(StatusCodes.OK).json({ success: true, data: req.user });
    });

    this.router.get('/:id', async (req: Request<{ id: string }>, res: Response<ItemApiResponse<User>>) =>
      this.userController.getById(req, res)
    );

    this.router.get('/', async (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<User>>) =>
      this.userController.getPage(req, res)
    );

    this.router.post('/', async (req: RequestWithBody<UserCreationAttributes>, res: Response<ItemApiResponse<User>>) =>
      this.userController.create(req, res)
    );

    this.router.put('/:id', async (req: RequestWithBody<User>, res: Response<ItemApiResponse<User>>) =>
      this.userController.updateOne(req, res)
    );

    this.router.put('/profile/', async (req: RequestWithBody<User>, res: Response<ItemApiResponse<User>>) =>
      this.userController.updateOne(req, res)
    );

    this.router.post('/change-password', async (req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>) =>
      this.userController.updatePassword(req, res)
    );

    this.router.post(
      '/:id/avatar',
      uploads.single('profile-pic-uploader'),
      async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Asset> | BaseResponse>) =>
        this.userController.updateAvatar(req, res)
    );

    this.router.delete('/:id/avatar', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.userController.deleteAvatar(req, res)
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.userController.deleteOne(req, res)
    );

    this.router.post(
      '/invite',
      async (req: RequestWithBody<UserAttributes[]>, res: Response<CollectionApiResponse<User> | BaseResponse>) =>
        this.userController.inviteMultiple(req, res)
    );

    this.router.delete('/session/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.userController.removeSession(req, res)
    );

    this.router.put(
      '/session-multiple/:sessionIds',
      async (req: RequestWithBody<{ sessionIds: number[] }>, res: Response<BaseResponse>) =>
        this.userController.removeSessionMultiple(req, res)
    );

    this.router.put(
      '/org/:id',
      async (req: RequestWithBody<OrganizationAttributes>, res: Response<ItemApiResponse<Organization>>) =>
        this.userController.updateOrg(req, res)
    );

    return this.router;
  }
}
