import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import {
  BaseResponse,
  Preference,
  ItemApiResponse,
  CollectionApiResponse,
  PreferenceCreationAttributes,
  User
} from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class PreferenceService {
  public async getAll(): Promise<Result<CollectionApiResponse<any>, BaseResponse>> {
    // Logger.Info(`Selecting preferences list...`);
    try {
      const preferencesList = Object.keys(Preference.rawAttributes)
        .filter((key) => Preference.rawAttributes[key].values)
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: Preference.rawAttributes[key].values
          };
        }, {});
      if (preferencesList) {
        return ok({ success: true, data: preferencesList });
      } else {
        return ok({ success: false, message: 'No preferences', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async set(
    user: User,
    preference: PreferenceCreationAttributes
  ): Promise<Result<ItemApiResponse<Preference>, BaseResponse>> {
    // Logger.Info(`Setting user preferences, userId: ${req.user.id}`);
    const userPreference = await user.getPreference();

    try {
      const data = userPreference
        ? await userPreference.update(preference)
        : await user.createPreference(preference as any);
      return ok({ success: true, data });
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
