import { Request, Response } from 'express';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  DepartmentCreationAttributes,
  DepartmentAttributes,
  RequestWithBody
} from '../models';
import { DepartmentService } from '../services';
import { BaseController } from './base/BaseController';
import { sendResponse } from './utils';

@Service()
export class DepartmentController extends BaseController<
  DepartmentCreationAttributes,
  DepartmentAttributes,
  Department
> {
  constructor(readonly dataBaseService: DepartmentService) {
    super();
  }

  public async getDashboardData(
    req: Request,
    res: Response<CollectionApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    const {
      user: { OrganizationId }
    } = req;
    const result = await this.dataBaseService.getDashboardData(OrganizationId);

    return sendResponse<CollectionApiResponse<Department>, BaseResponse>(result, res);
  }

  public generateCreationAttributes(req: RequestWithBody<DepartmentCreationAttributes>): DepartmentCreationAttributes {
    return {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
  }
}
