import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import { BaseResponse, ItemApiResponse, RequestWithQuery, RequestWithBody } from '../models';
import { PlanCreationAttributes, PlanAttributes, Plan, Asset, AssetCreationAttributes } from '../repositories';
import { PlanService } from '../services';

import { BaseController } from './base/base.controller';
import { sendResponse } from './utils';

@Service()
export class PlanController extends BaseController<PlanCreationAttributes, PlanAttributes, Plan> {
  constructor(protected readonly dataBaseService: PlanService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_PLAN);
  }

  public async addDocument(
    req: Request<{ planId: string }>,
    res: Response<ItemApiResponse<Asset> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Uploading plan document: ${req.file.originalname}...`);

    const params: { document: AssetCreationAttributes; planId: string } = {
      document: {
        title: req.file.originalname,
        location: req.file.destination.split('uploads')[1] as string,
        type: req.file.mimetype
      },
      planId: req.params.planId
    };

    const result = await this.dataBaseService.addDocument(params);

    return sendResponse<ItemApiResponse<Asset>, CustomError>(result, res);
  }

  public async deleteDocument(
    req: RequestWithQuery<{ planId: string; docId: string }>,
    res: Response<BaseResponse>
  ): Promise<void> {
    const {
      query: { docId }
    } = req;
    req.log.info(`Deleting plan document by id: ${docId}...`);
    const result = await this.dataBaseService.deleteDocument(docId);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  protected generateCreationAttributes(req: RequestWithBody<PlanCreationAttributes>): PlanCreationAttributes {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = req.user!;
    return {
      ...req.body,
      OrganizationId: user.OrganizationId,
      CreatorId: user.id
    };
  }
}
