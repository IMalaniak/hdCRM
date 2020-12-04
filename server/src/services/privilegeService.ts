import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import {
  BaseResponse,
  Privilege,
  ItemApiResponse,
  CollectionApiResponse,
  PrivilegeCreationAttributes
} from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class PrivilegeService {
  constructor(private readonly logger: Logger) {}

  public async getAll(): Promise<Result<CollectionApiResponse<any>, BaseResponse>> {
    try {
      const data = await Privilege.findAndCountAll();
      if (data) {
        return ok({ success: true, data: data.rows, resultsNum: data.count });
      } else {
        return ok({ success: false, message: 'No privileges', data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(
    privilege: PrivilegeCreationAttributes
  ): Promise<Result<ItemApiResponse<Privilege>, BaseResponse>> {
    try {
      const data = await Privilege.create({
        ...privilege
      });

      return ok({ success: true, message: 'Privilege is created successfully!', data });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
