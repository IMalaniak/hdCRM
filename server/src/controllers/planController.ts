import { Request, Response } from 'express';
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
  Asset
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
    const result = await this.planService.getDataById(id);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>,
    res: Response<CollectionApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    const { pageSize, pageIndex, sortDirection, sortIndex } = req.query;
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;
    const OrganizationId = req.user.OrganizationId;

    const result = await this.planService.getPage({
      sortDirection: sortDirection.toUpperCase(),
      sortIndex,
      limit,
      offset,
      OrganizationId
    });

    return sendResponse<CollectionApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<PlanCreationAttributes>,
    res: Response<ItemApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    const plan: PlanCreationAttributes = {
      ...req.body,
      OrganizationId: req.user.OrganizationId
    };
    const result = await this.planService.create(plan);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async updateOne(
    req: RequestWithBody<Plan>,
    res: Response<ItemApiResponse<Plan> | BaseResponse>
  ): Promise<void> {
    const result = await this.planService.updateOne(req.body);

    return sendResponse<ItemApiResponse<Plan>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    const result = await this.planService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }

  public async addDocument(
    req: Request<{ planId: string }>,
    res: Response<ItemApiResponse<Asset> | BaseResponse>
  ): Promise<void> {
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
    const result = await this.planService.deleteDocument(docId);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
