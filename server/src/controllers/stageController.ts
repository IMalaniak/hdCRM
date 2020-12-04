import { Request, Response } from 'express';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  ItemApiResponse,
  Stage,
  StageCreationAttributes,
  RequestWithBody
} from '../models';
import { sendResponse } from './utils';
import { StageService } from '../services';

@Service()
export class StageController {
  constructor(private readonly stageService: StageService) {}

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting stages list...`);

    const result = await this.stageService.getAll(req.user.OrganizationId);

    return sendResponse<CollectionApiResponse<any>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<StageCreationAttributes>,
    res: Response<ItemApiResponse<Stage> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new stage...`);

    const result = await this.stageService.create(req.body);

    return sendResponse<ItemApiResponse<Stage>, BaseResponse>(result, res);
  }
}
