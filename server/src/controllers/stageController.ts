import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CollectionApiResponse, Stage, StageCreationAttributes, StageAttributes, BaseResponse } from '../models';
import { StageService } from '../services';
import { sendResponse } from './utils';
import { BaseController } from './base/baseController';
import { CustomError } from '../errors';

@Service()
export class StageController extends BaseController<StageCreationAttributes, StageAttributes, Stage> {
  constructor(protected readonly dataBaseService: StageService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_STAGE);
  }

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting stages list...`);

    const result = await this.dataBaseService.getAll(req.user.OrganizationId);

    return sendResponse<CollectionApiResponse<any> | BaseResponse, CustomError>(result, res);
  }
}
