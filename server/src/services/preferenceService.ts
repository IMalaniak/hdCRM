import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Preference, ItemApiResponse, PreferenceCreationAttributes, User } from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class PreferenceService {
  constructor(private readonly logger: Logger) {}

  public async getAll(): Promise<Result<ItemApiResponse<any>, BaseResponse>> {
    const preferencesList = Object.keys(Preference.rawAttributes)
      .filter((key) => Preference.rawAttributes[key].values)
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: Preference.rawAttributes[key].values
        };
      }, {});
    if (Object.keys(preferencesList).length) {
      return ok({ success: true, data: preferencesList });
    } else {
      return ok({ success: false, message: 'No preferences', data: {} });
    }
  }

  public async set(
    user: User,
    preference: PreferenceCreationAttributes
  ): Promise<Result<ItemApiResponse<Preference>, BaseResponse>> {
    const userPreference = await user.getPreference();

    try {
      const data = userPreference
        ? await userPreference.update(preference)
        : await user.createPreference(preference as any);
      return ok({ success: true, data });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
