import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import {
  BaseResponse,
  CollectionApiResponse,
  Role,
  RequestWithBody,
  RoleCreationAttributes,
  RoleAttributes
} from '../models';
import { RoleService } from '../services';
import { BaseController } from './base/baseController';
import { sendResponse } from './utils';

@Service()
export class RoleController extends BaseController<RoleCreationAttributes, RoleAttributes, Role> {
  constructor(readonly dataBaseService: RoleService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_ROLE);
  }

  public async getDashboardData(
    req: Request,
    res: Response<CollectionApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Geting roles dashboard data...`);

    const {
      user: { OrganizationId }
    } = req;
    const result = await this.dataBaseService.getDashboardData(OrganizationId);

    return sendResponse<CollectionApiResponse<Role>, BaseResponse>(result, res);
  }

  public generateCreationAttributes(req: RequestWithBody<RoleCreationAttributes>): RoleCreationAttributes {
    return {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
  }
}
