import { Request, Response } from 'express';
import qs from 'qs';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  Plan,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery,
  PlanCreationAttributes,
  AssetCreationAttributes,
  Asset,
  ParsedFilters
} from '../models';
import { PlanService } from '../services';
import { sendResponse } from './utils';

@Service()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  public async getDataById(
    req: Request<{ id: string }>,
    res: Response<ItemApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Selecting plan by id: ${id}...`);

    const result = await this.planService.getByPk(id);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Getting plans by page query...`);

    const { pageSize, pageIndex, sortDirection, sortIndex, filters } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.planService.getPage({
      sortDirection: sortDirection.toUpperCase(),
      sortIndex,
      limit,
      offset,
      parsedFilters: filters ? (qs.parse(filters) as ParsedFilters) : {},
      OrganizationId
    });

    return sendResponse<CollectionApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<PlanCreationAttributes>,
    res: Response<ItemApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new plan...`);

    const plan: PlanCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId,
      CreatorId: req.user.id
    };
    const result = await this.planService.create(plan);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async updateOne(
    req: RequestWithBody<Plan>,
    res: Response<ItemApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Updating plan by id: ${req.body.id}...`);

    const result = await this.planService.update(req.body);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    req.log.info(`Deleting plan(s) by id: ${id}...`);

    const result = await this.planService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public async addDocument(
    req: Request<{ planId: string }>,
    res: Response<ItemApiResponse<Asset> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Uploading plan document: ${req.file.originalname}...`);

    const params: { document: AssetCreationAttributes; planId: string } = {
      document: {
        title: req.file.originalname,
        location: req.file.destination.split('uploads')[1],
        type: req.file.mimetype
      },
      planId: req.params.planId
    };

    const result = await this.planService.addDocument(params);

    return sendResponse<ItemApiResponse<Asset>, BaseResponse>(result, res);
  }

  public async deleteDocument(
    req: RequestWithQuery<{ planId: string; docId: string }>,
    res: Response<BaseResponse>
  ): Promise<void> {
    const {
      query: { docId }
    } = req;
    req.log.info(`Deleting plan document by id: ${docId}...`);
    const result = await this.planService.deleteDocument(docId);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
