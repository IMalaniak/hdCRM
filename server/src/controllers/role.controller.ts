import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import { CollectionApiResponse, RequestWithBody, BaseResponse } from '../models';
import { RoleCreationAttributes, RoleAttributes, Role } from '../repositories';
import { RoleService } from '../services';
import { BaseController } from './base/base.controller';
import { sendResponse } from './utils';

@Service()
export class RoleController extends BaseController<RoleCreationAttributes, RoleAttributes, Role> {
  constructor(protected readonly dataBaseService: RoleService) {
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

    return sendResponse<CollectionApiResponse<Role>, CustomError>(result, res);
  }

  protected generateCreationAttributes(req: RequestWithBody<RoleCreationAttributes>): RoleCreationAttributes {
    return {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
  }
}
