import { Request, Response } from 'express';
import { Service } from 'typedi';

import { BaseResponse, CollectionApiResponse, Stage, StageCreationAttributes, StageAttributes } from '../models';
import { sendResponse } from './utils';
import { StageService } from '../services';
import { BaseController } from './base/BaseController';

@Service()
export class StageController extends BaseController<StageCreationAttributes, StageAttributes, Stage> {
  constructor(readonly dataBaseService: StageService) {
    super();
  }

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting stages list...`);

    const result = await this.dataBaseService.getAll(req.user.OrganizationId);

    return sendResponse<CollectionApiResponse<any>, BaseResponse>(result, res);
  }
}
