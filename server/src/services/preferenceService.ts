import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { Preference, ItemApiResponse, PreferenceCreationAttributes, User } from '../models';
import { Logger } from '../utils/Logger';
import { CustomError, InternalServerError } from '../errors';

@Service()
export class PreferenceService {
  constructor(private readonly logger: Logger) {}

  public async getAll(): Promise<Result<ItemApiResponse<any>, CustomError>> {
    const preferencesList = Object.keys(Preference.rawAttributes)
      .filter((key) => Preference.rawAttributes[key].values)
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: Preference.rawAttributes[key].values
        };
      }, {});
    if (Object.keys(preferencesList).length) {
      return ok({ data: preferencesList });
    } else {
      return ok({ message: 'No preferences', data: null });
    }
  }

  public async set(
    user: User,
    preference: PreferenceCreationAttributes
  ): Promise<Result<ItemApiResponse<Preference>, CustomError>> {
    const userPreference = await user.getPreference();

    try {
      const data = userPreference
        ? await userPreference.update(preference)
        : await user.createPreference(preference as any);
      return ok({ data });
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
