import { Request, Response } from 'express';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery,
  DepartmentCreationAttributes
} from '../models';
import { DepartmentService } from '../services';
import { sendResponse } from './utils';

@Service()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  public async getDashboardData(
    req: Request,
    res: Response<CollectionApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    const {
      user: { OrganizationId }
    } = req;
    const result = await this.departmentService.getDashboardData(OrganizationId);

    return sendResponse<CollectionApiResponse<Department>, BaseResponse>(result, res);
  }

  public async getDataById(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting department by id: ${id}...`);
    const result = await this.departmentService.getDataById(id);

    return sendResponse<ItemApiResponse<Department>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Getting departments by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.departmentService.getPage({
      sortDirection: sortDirection.toUpperCase(),
      sortIndex,
      limit,
      offset,
      OrganizationId
    });

    return sendResponse<CollectionApiResponse<Department>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<DepartmentCreationAttributes>,
    res: Response<ItemApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new department...`);

    const department: DepartmentCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.departmentService.create(department);

    return sendResponse<ItemApiResponse<Department>, BaseResponse>(result, res);
  }

  public async updateOne(
    req: RequestWithBody<Department>,
    res: Response<ItemApiResponse<Department> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Updating department by id: ${req.body.id}...`);

    const result = await this.departmentService.updateOne(req.body);

    return sendResponse<ItemApiResponse<Department>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting department(s) by id: ${id}...`);
    const result = await this.departmentService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
