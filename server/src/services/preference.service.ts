import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { ItemApiResponse, BaseResponse } from '../models';
import { Logger } from '../utils/Logger';
import { CustomError, InternalServerError } from '../errors';
import { Preference, User, PreferenceCreationAttributes } from '../repositories';

@Service()
export class PreferenceService {
  constructor(private readonly logger: Logger) {}

  public getAll(): Result<ItemApiResponse<any> | BaseResponse, CustomError> {
    const preferencesList = Object.keys(Preference.rawAttributes)
      .filter((key) => Preference.rawAttributes[key]?.values)
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: Preference.rawAttributes[key]?.values
        };
      }, {});
    if (Object.keys(preferencesList).length) {
      return ok({ data: preferencesList });
    } else {
      return ok({});
    }
  }

  public async set(
    user: User,
    preference: PreferenceCreationAttributes
  ): Promise<Result<ItemApiResponse<Preference>, CustomError>> {
    const userPreference = await user.getPreference();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const data = userPreference?.id
        ? await userPreference.update(preference)
        : await user.createPreference(preference as any);
      return ok({ data });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }
}
