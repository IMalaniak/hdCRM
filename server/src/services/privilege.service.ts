import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { ItemApiResponse, CollectionApiResponse, BaseResponse } from '../models';
import { Logger } from '../utils/Logger';
import { CustomError, InternalServerError } from '../errors';
import { Privilege, PrivilegeCreationAttributes } from '../repositories';

@Service()
export class PrivilegeService {
  constructor(private readonly logger: Logger) {}

  public async getAll(): Promise<Result<CollectionApiResponse<any> | BaseResponse, CustomError>> {
    try {
      const data = await Privilege.findAndCountAll();
      if (data.count) {
        return ok({ data: data.rows, resultsNum: data.count });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }
}
