import { Request, Response } from 'express';
import qs from 'qs';
import { Inject } from 'typedi';
import { Model } from 'sequelize';

import { sendResponse } from '../utils';
import {
  BaseResponse,
  CollectionApiResponse,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery,
  ParsedFilters
} from '../../models';
import { CONSTANTS } from '../../constants';
import { IBaseService } from '../../services/base/IBaseService';

export abstract class BaseController<C, A, M extends Model<A, C>> {
  readonly dataBaseService: IBaseService<C, A, M>;

  @Inject(CONSTANTS.MODELS_NAME)
  modelName: string;

  public async getByPk(req: Request<{ id: string }>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting ${this.modelName} by id: ${id}...`);
    const result = await this.dataBaseService.getByPk(id);

    return sendResponse<ItemApiResponse<M>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<M> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Getting ${this.modelName} by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex, filters } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.dataBaseService.getPage(
      {
        sortDirection: sortDirection.toUpperCase(),
        sortIndex,
        limit,
        offset,
        parsedFilters: filters ? (qs.parse(filters) as ParsedFilters) : {}
      },
      OrganizationId
    );

    return sendResponse<CollectionApiResponse<M>, BaseResponse>(result, res);
  }

  public async create(req: RequestWithBody<C>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    req.log.info(`Creating new ${this.modelName}...`);

    const item: C = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.dataBaseService.create(item);

    return sendResponse<ItemApiResponse<M>, BaseResponse>(result, res);
  }

  public async update(req: RequestWithBody<A>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    req.log.info(`Updating ${this.modelName} by id...`);

    const result = await this.dataBaseService.update(req.body);

    return sendResponse<ItemApiResponse<M>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting ${this.modelName} by id: ${id}...`);
    const result = await this.dataBaseService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
