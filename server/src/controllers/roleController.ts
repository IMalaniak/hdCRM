import { Request, Response } from 'express';
import qs from 'qs';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  Role,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery,
  RoleCreationAttributes,
  ParsedFilters
} from '../models';
import { RoleService } from '../services';
import { sendResponse } from './utils';

@Service()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  public async getDashboardData(
    req: Request,
    res: Response<CollectionApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Geting roles dashboard data...`);

    const {
      user: { OrganizationId }
    } = req;
    const result = await this.roleService.getDashboardData(OrganizationId);

    return sendResponse<CollectionApiResponse<Role>, BaseResponse>(result, res);
  }

  public async getDataById(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting role by id: ${id}...`);

    const result = await this.roleService.getByPk(id);

    return sendResponse<ItemApiResponse<Role>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Getting roles by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex, filters } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.roleService.getPage(
      {
        sortDirection: sortDirection.toUpperCase(),
        sortIndex,
        limit,
        offset,
        parsedFilters: filters ? (qs.parse(filters) as ParsedFilters) : {}
      },
      OrganizationId
    );

    return sendResponse<CollectionApiResponse<Role>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<RoleCreationAttributes>,
    res: Response<ItemApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new role...`);

    const role: RoleCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.roleService.create(role);

    return sendResponse<ItemApiResponse<Role>, BaseResponse>(result, res);
  }

  public async updateOne(
    req: RequestWithBody<Role>,
    res: Response<ItemApiResponse<Role> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Updating role by id: ${req.body.id}...`);

    const result = await this.roleService.update(req.body);

    return sendResponse<ItemApiResponse<Role>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting role by id: ${id}...`);
    const result = await this.roleService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
