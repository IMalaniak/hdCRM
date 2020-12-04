import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Stage, ItemApiResponse, CollectionApiResponse, StageCreationAttributes } from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class StageService {
  constructor(private readonly logger: Logger) {}

  public async getAll(OrganizationId: number): Promise<Result<CollectionApiResponse<any>, BaseResponse>> {
    try {
      const data = await Stage.findAndCountAll({
        include: [
          {
            association: Stage.associations.Plans,
            where: {
              OrganizationId
            },
            attributes: ['id']
          }
        ]
      });
      if (data) {
        return ok({ success: true, data: data.rows, resultsNum: data.count });
      } else {
        return ok({ success: false, message: 'No stages', data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(stage: StageCreationAttributes): Promise<Result<ItemApiResponse<Stage>, BaseResponse>> {
    try {
      const data = await Stage.create({
        ...stage
      });

      return ok({ success: true, essage: 'Stage is created successfully!', data });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
