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
import { BaseService } from '../../services/base/base.service';
import { CustomError } from '../../errors/custom-error';

export abstract class BaseController<C, A, M extends Model<A, C>> {
  protected readonly dataBaseService!: BaseService<C, A, M>;

  @Inject(CONSTANTS.MODELS_NAME)
  protected modelName!: string;

  public async getByPk(req: Request<{ id: string }>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting ${this.modelName} by id: ${id}...`);
    const result = await this.dataBaseService.getByPk(id);

    return sendResponse<ItemApiResponse<M>, CustomError>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<M> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Getting ${this.modelName} by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex, filters } = req.query;
    const limit = +pageSize;
    const offset = +pageIndex * limit;

    const result = await this.dataBaseService.getPage(
      {
        sortDirection: sortDirection.toUpperCase(),
        sortIndex,
        limit,
        offset,
        parsedFilters: filters ? (qs.parse(filters) as ParsedFilters) : {}
      },
      // TODO: optional OrganizationId
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.OrganizationId
    );

    return sendResponse<CollectionApiResponse<M> | BaseResponse, CustomError>(result, res);
  }

  public async create(req: RequestWithBody<C>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    req.log.info(`Creating new ${this.modelName}...`);

    const item: C = this.generateCreationAttributes(req);
    const result = await this.dataBaseService.create(item);

    return sendResponse<ItemApiResponse<M>, CustomError>(result, res);
  }

  public async update(req: RequestWithBody<A>, res: Response<ItemApiResponse<M> | BaseResponse>): Promise<void> {
    req.log.info(`Updating ${this.modelName} by id...`);

    const result = await this.dataBaseService.update(req.body);

    return sendResponse<ItemApiResponse<M>, CustomError>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse | BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting ${this.modelName} by id: ${id}...`);
    const result = await this.dataBaseService.delete(id);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  protected generateCreationAttributes(req: RequestWithBody<C>): C {
    return req.body;
  }
}
