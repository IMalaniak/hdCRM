import { Service } from 'typedi';
import jimp from 'jimp';
import qs from 'qs';

import {
  User,
  UserSession,
  Organization,
  CollectionQuery,
  OrganizationAttributes,
  ItemApiResponse,
  BaseResponse,
  CollectionApiResponse,
  RequestWithQuery,
  RequestWithBody,
  UserCreationAttributes,
  PasswordReset,
  UserAttributes,
  Asset,
  AssetCreationAttributes,
  ParsedFilters
} from '../models';
import { UserService } from '../services';
import { Request, Response } from 'express';
import { sendResponse } from './utils';
import { parseCookies } from '../utils/parseCookies';
import { JwtHelper } from '../helpers/jwtHelper';

@Service()
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtHelper: JwtHelper) {}

  public async getById(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<User> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting user by id: ${id}...`);

    const result = await this.userService.getByPk(id);

    return sendResponse<ItemApiResponse<User>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<User> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Selecting users by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex, filters } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.userService.getPage(
      {
        sortDirection: sortDirection.toUpperCase(),
        sortIndex,
        limit,
        offset,
        parsedFilters: filters ? (qs.parse(filters) as ParsedFilters) : {}
      },
      OrganizationId
    );

    return sendResponse<CollectionApiResponse<User>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<UserCreationAttributes>,
    res: Response<ItemApiResponse<User> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new user...`);

    const user: UserCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.userService.create(user);

    return sendResponse<ItemApiResponse<User>, BaseResponse>(result, res);
  }

  public async updateOne(
    req: RequestWithBody<User>,
    res: Response<ItemApiResponse<User> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Updating user by id: ${req.body.id}...`);

    const result = await this.userService.update(req.body);

    return sendResponse<ItemApiResponse<User>, BaseResponse>(result, res);
  }

  public async deleteOne(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting user by id: ${id}...`);

    const result = await this.userService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
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
}
