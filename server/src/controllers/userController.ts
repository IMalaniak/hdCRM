import { Service } from 'typedi';
import jimp from 'jimp';

import {
  User,
  UserSession,
  Organization,
  OrganizationAttributes,
  ItemApiResponse,
  BaseResponse,
  CollectionApiResponse,
  RequestWithBody,
  UserCreationAttributes,
  PasswordReset,
  UserAttributes,
  Asset,
  AssetCreationAttributes
} from '../models';
import { UserService } from '../services';
import { Request, Response } from 'express';
import { sendResponse } from './utils';
import { parseCookies } from '../utils/parseCookies';
import { JwtHelper } from '../helpers/jwtHelper';
import { BaseController } from './base/BaseController';

@Service()
export class UserController extends BaseController<UserCreationAttributes, UserAttributes, User> {
  constructor(readonly userService: UserService, private readonly jwtHelper: JwtHelper) {
    super();
  }

  public async updatePassword(req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>): Promise<void> {
    req.log.info(`Changing user password...`);

    let sId: number;
    if (req.body.deleteSessions) {
      const cookies = parseCookies(req) as any;
      if (cookies.refresh_token) {
        const decodedResult = this.jwtHelper.getDecoded(cookies.refresh_token);
        if (decodedResult.isOk()) {
          sId = decodedResult.value.sessionId;
        }
      }
    }

    const passData: PasswordReset & { userId: number; sessionId?: number } = {
      ...req.body,
      userId: req.user.id,
      ...(req.body.deleteSessions && { sessionId: sId })
    };

    const result = await this.userService.updatePassword(passData);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public async getSession(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<UserSession> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Getting user session by id: ${id}...`);

    const result = await this.userService.getSession(id);

    return sendResponse<ItemApiResponse<UserSession>, BaseResponse>(result, res);
  }

  public async getSessionList(
    req: Request,
    res: Response<CollectionApiResponse<UserSession> | BaseResponse>
  ): Promise<void> {
    const currentUser = req.user;
    req.log.info(`Getting session list for user id: ${currentUser.id}...`);
    const result = await this.userService.getSessionList(currentUser);

    return sendResponse<CollectionApiResponse<UserSession>, BaseResponse>(result, res);
  }

  public async removeSession(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Removing user session`);

    const result = await this.userService.removeSession(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public async removeSessionMultiple(
    req: RequestWithBody<{ sessionIds: number[] }>,
    res: Response<BaseResponse>
  ): Promise<void> {
    const {
      body: { sessionIds }
    } = req;
    req.log.info(`Removing user sessions`);
    const result = await this.userService.removeSession(sessionIds);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public async updateOrg(
    req: RequestWithBody<OrganizationAttributes>,
    res: Response<ItemApiResponse<Organization>>
  ): Promise<void> {
    req.log.info(`Update user organization by id: ${req.body.id}`);

    const result = await this.userService.updateOrg(req.body);

    return sendResponse<ItemApiResponse<Organization>, BaseResponse>(result, res);
  }

  public async inviteMultiple(
    req: RequestWithBody<UserAttributes[]>,
    res: Response<CollectionApiResponse<User> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Invite multiple users`);

    const result = await this.userService.inviteMultiple(req.body, req.user.OrganizationId);

    return sendResponse<CollectionApiResponse<User>, BaseResponse>(result, res);
  }

  public async updateAvatar(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<Asset> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Update user avatar`);

    if (req.file) {
      jimp.read(req.file.path).then((tpl) =>
        tpl
          .clone()
          .resize(100, jimp.AUTO)
          .write(req.file.destination + '/thumbnails/' + req.file.originalname)
      );
    }

    const params: { avatar: AssetCreationAttributes; userId: string } = {
      avatar: {
        title: req.file.originalname,
        location: req.file.destination.split('uploads')[1],
        type: req.file.mimetype
      },
      userId: req.params.id
    };

    const result = await this.userService.updateAvatar(params);

    return sendResponse<ItemApiResponse<Asset>, BaseResponse>(result, res);
  }

  public async deleteAvatar(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Delete user avatar by id: ${id}`);

    const result = await this.userService.deleteAvatar(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public generateCreationAttributes(req: RequestWithBody<UserCreationAttributes>): UserCreationAttributes {
    return {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
  }
}
