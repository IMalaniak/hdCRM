import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { BaseResponse, CollectionApiResponse, Stage, StageCreationAttributes, StageAttributes } from '../models';
import { StageService } from '../services';
import { sendResponse } from './utils';
import { BaseController } from './base/baseController';

@Service()
export class StageController extends BaseController<StageCreationAttributes, StageAttributes, Stage> {
  constructor(readonly dataBaseService: StageService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_STAGE);
  }

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting stages list...`);

    const result = await this.dataBaseService.getAll(req.user.OrganizationId);

    return sendResponse<CollectionApiResponse<any>, BaseResponse>(result, res);
  }
}
