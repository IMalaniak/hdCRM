import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Stage, ItemApiResponse, CollectionApiResponse, StageCreationAttributes, Plan } from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class StageService {
  public async getAll(OrganizationId: number): Promise<Result<CollectionApiResponse<any>, BaseResponse>> {
    // Logger.Info(`Selecting stages list...`);
    try {
      const data = await Stage.findAndCountAll({
        include: [
          {
            model: Plan as any,
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
        return ok({ success: false, message: 'No stages', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(stage: StageCreationAttributes): Promise<Result<ItemApiResponse<Stage>, BaseResponse>> {
    // Logger.Info(`Creating new stage...`);
    try {
      const data = await Stage.create({
        ...stage
      });

      return ok({ success: true, essage: 'Stage is created successfully!', data });
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
