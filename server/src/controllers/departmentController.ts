import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import {
  CollectionApiResponse,
  Department,
  DepartmentCreationAttributes,
  DepartmentAttributes,
  RequestWithBody,
  BaseResponse
} from '../models';
import { DepartmentService } from '../services';
import { BaseController } from './base/baseController';
import { sendResponse } from './utils';

@Service()
export class DepartmentController extends BaseController<
  DepartmentCreationAttributes,
  DepartmentAttributes,
  Department
> {
  constructor(protected readonly dataBaseService: DepartmentService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_DEPARTMENT);
  }

  public async getDashboardData(
    req: Request,
    res: Response<CollectionApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Geting department dashboard data...`);

    const {
      user: { OrganizationId }
    } = req;
    const result = await this.dataBaseService.getDashboardData(OrganizationId);

    return sendResponse<CollectionApiResponse<Department>, CustomError>(result, res);
  }

  protected generateCreationAttributes(
    req: RequestWithBody<DepartmentCreationAttributes>
  ): DepartmentCreationAttributes {
    return {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
  }
}
