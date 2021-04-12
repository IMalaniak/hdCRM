import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CollectionApiResponse, BaseResponse } from '../models';
import { StageService } from '../services';
import { sendResponse } from './utils';
import { BaseController } from './base/base.controller';
import { CustomError } from '../errors';
import { StageCreationAttributes, StageAttributes, Stage } from '../repositories';

@Service()
export class StageController extends BaseController<StageCreationAttributes, StageAttributes, Stage> {
  constructor(protected readonly dataBaseService: StageService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_STAGE);
  }

  public async getAll(req: Request, res: Response<CollectionApiResponse<Stage> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting stages list...`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.dataBaseService.getAll(req.user!.OrganizationId);

    return sendResponse<CollectionApiResponse<Stage> | BaseResponse, CustomError>(result, res);
  }
}
