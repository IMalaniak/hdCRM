import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { Privilege, ItemApiResponse, CollectionApiResponse, PrivilegeCreationAttributes } from '../models';
import { Logger } from '../utils/Logger';
import { CustomError, InternalServerError } from '../errors';

@Service()
export class PrivilegeService {
  constructor(private readonly logger: Logger) {}

  public async getAll(): Promise<Result<CollectionApiResponse<any>, CustomError>> {
    try {
      const data = await Privilege.findAndCountAll();
      if (data.count) {
        return ok({ data: data.rows, resultsNum: data.count });
      } else {
        return ok({ message: 'No privileges', data: [] });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async create(
    privilege: PrivilegeCreationAttributes
  ): Promise<Result<ItemApiResponse<Privilege>, CustomError>> {
    try {
      const data = await Privilege.create({
        ...privilege
      });

      return ok({ message: 'Privilege is created successfully!', data });
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
