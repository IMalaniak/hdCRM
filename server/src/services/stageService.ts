import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Stage, CollectionApiResponse, StageCreationAttributes, StageAttributes } from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';

@Service()
export class StageService extends BaseService<StageCreationAttributes, StageAttributes, Stage> {
  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Stage);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_STAGE);
  }

  public async getAll(OrganizationId: number): Promise<Result<CollectionApiResponse<Stage>, BaseResponse>> {
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
        return ok({ success: true, data: data.rows, resultsNum: data.count });
      } else {
        return ok({ success: false, message: `No ${CONSTANTS.MODELS_NAME_STAGE}s by this query`, data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public sideEffect(_, key: string | number): Promise<Stage> {
    return this.findByPk(key);
  }
}
