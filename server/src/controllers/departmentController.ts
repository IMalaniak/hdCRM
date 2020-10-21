import { Request } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  ApiResponse,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery,
  DepartmentCreationAttributes
} from '../models';
import { DepartmentService } from '../services';

@Service()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  public async getDashboardData(req: Request): Promise<ApiResponse<CollectionApiResponse<Department> | BaseResponse>> {
    const {
      user: { OrganizationId }
    } = req;
    const result = await this.departmentService.getDashboardData(OrganizationId);

    return result.match<ApiResponse<CollectionApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async getDataById(
    req: Request<{ id: string }>
  ): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    const {
      params: { id }
    } = req;
    const result = await this.departmentService.getDataById(id);

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>
  ): Promise<ApiResponse<CollectionApiResponse<Department> | BaseResponse>> {
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

    return result.match<ApiResponse<CollectionApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async create(
    req: RequestWithBody<DepartmentCreationAttributes>
  ): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    // Logger.Info(`Creating new department...`);
    const department: DepartmentCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.departmentService.create(department);

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async updateOne(
    req: RequestWithBody<Department>
  ): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    const result = await this.departmentService.updateOne(req.body);

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async delete(req: Request<{ id: string }>): Promise<ApiResponse<BaseResponse>> {
    const {
      params: { id }
    } = req;
    const result = await this.departmentService.delete(id);

    return result.match<ApiResponse<BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }
}
