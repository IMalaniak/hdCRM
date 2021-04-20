import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { ItemApiResponse, BaseResponse, CollectionApiResponse, RequestWithBody, PasswordReset } from '../models';
import { UserService } from '../services';
import { CustomError } from '../errors';
import {
  UserCreationAttributes,
  UserAttributes,
  User,
  UserSession,
  OrganizationAttributes,
  Organization
} from '../repositories';
import { JwtUtils } from '../utils/jwt.utils';
import { parseCookies } from '../utils/parseCookies';

import { sendResponse } from './utils';
import { BaseController } from './base/base.controller';

@Service()
export class UserController extends BaseController<UserCreationAttributes, UserAttributes, User> {
  constructor(protected readonly dataBaseService: UserService, private readonly jwtHelper: JwtUtils) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_USER);
  }

  public async updatePassword(
    req: RequestWithBody<PasswordReset>,
    res: Response<BaseResponse | BaseResponse>
  ): Promise<void> {
    req.log.info(`Changing user password...`);

    let sId: number | undefined;
    if (req.body.deleteSessions) {
      const cookies = parseCookies(req);
      if (cookies.refresh_token) {
        const decodedResult = this.jwtHelper.decode(cookies.refresh_token);
        if (decodedResult.isOk()) {
          sId = decodedResult.value.sub;
        }
      }
    }

    const passData: PasswordReset & { userId: number; sessionId?: number } = {
      ...req.body,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: req.user!.id,
      ...(req.body.deleteSessions && { sessionId: sId })
    };

    const result = await this.dataBaseService.updatePassword(passData);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async getSession(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<UserSession> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Getting user session by id: ${id}...`);

    const result = await this.dataBaseService.getSession(id);

    return sendResponse<ItemApiResponse<UserSession>, CustomError>(result, res);
  }

  public async getSessionList(
    req: Request,
    res: Response<CollectionApiResponse<UserSession> | BaseResponse>
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = req.user!;
    req.log.info(`Getting session list for user id: ${currentUser.id}...`);
    const result = await this.dataBaseService.getSessionList(currentUser);

    return sendResponse<CollectionApiResponse<UserSession> | BaseResponse, CustomError>(result, res);
  }

  public async removeSession(req: Request<{ id: string }>, res: Response<BaseResponse | CustomError>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Removing user session`);

    const result = await this.dataBaseService.removeSession(id);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async removeSessionMultiple(
    req: RequestWithBody<{ sessionIds: number[] }>,
    res: Response<BaseResponse>
  ): Promise<void> {
    const {
      body: { sessionIds }
    } = req;
    req.log.info(`Removing user sessions`);
    const result = await this.dataBaseService.removeSession(sessionIds);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async updateOrg(
    req: RequestWithBody<OrganizationAttributes>,
    res: Response<ItemApiResponse<Organization> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Update user organization by id: ${req.body.id}`);

    const result = await this.dataBaseService.updateOrg(req.body);

    return sendResponse<ItemApiResponse<Organization>, CustomError>(result, res);
  }

  public async inviteMultiple(
    req: RequestWithBody<UserAttributes[]>,
    res: Response<CollectionApiResponse<User> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Invite multiple users`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.dataBaseService.inviteMultiple(req.body, req.user!.OrganizationId);

    return sendResponse<CollectionApiResponse<User>, CustomError>(result, res);
  }

  protected generateCreationAttributes(req: RequestWithBody<UserCreationAttributes>): UserCreationAttributes {
    return {
      ...req.body,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      OrganizationId: req.user!.OrganizationId
    };
  }
}
