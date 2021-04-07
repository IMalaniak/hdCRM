import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { Stage, CollectionApiResponse, StageCreationAttributes, StageAttributes, BaseResponse } from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';
import { CustomError, InternalServerError } from '../errors';

@Service()
export class StageService extends BaseService<StageCreationAttributes, StageAttributes, Stage> {
  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Stage);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_STAGE);
  }

  public async getAll(
    OrganizationId: number
  ): Promise<Result<CollectionApiResponse<Stage> | BaseResponse, CustomError>> {
    try {
      const data = await Stage.findAndCountAll({
        include: [
          {
            association: Stage.associations?.Plans,
            where: {
              OrganizationId
            },
            attributes: ['id']
          }
        ]
      });
      if (data.count) {
        return ok({ data: data.rows, resultsNum: data.count });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
