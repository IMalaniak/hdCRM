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

@Service()
export class PrivilegeService {
  public async getAll(): Promise<Result<CollectionApiResponse<any>, BaseResponse>> {
    // Logger.Info(`Selecting privileges list...`);
    try {
      const data = await Privilege.findAndCountAll();
      if (data) {
        return ok({ success: true, data: data.rows, resultsNum: data.count });
      } else {
        return ok({ success: false, message: 'No privileges', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(
    privilege: PrivilegeCreationAttributes
  ): Promise<Result<ItemApiResponse<Privilege>, BaseResponse>> {
    // Logger.Info(`Creating new privilege...`);
    try {
      const data = await Privilege.create({
        ...privilege
      });

      return ok({ success: true, message: 'Privilege is created successfully!', data });
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
