import { err, ok, Result } from 'neverthrow';
import { IncludeOptions, Model, WhereOptions } from 'sequelize';
import { Inject } from 'typedi';

import { CONSTANTS } from '../../constants';
import { BaseResponse, CollectionApiResponse, ErrorOrigin, ItemApiResponse, PageQuery } from '../../models';
import { Logger } from '../../utils/Logger';
import { IBaseService } from './IBaseService';

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = new () => T;
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

export abstract class BaseService<C, A, M extends Model<A, C>> implements IBaseService<C, A, M> {
  @Inject(CONSTANTS.MODEL)
  MODEL: NonAbstractTypeOfModel<M>;

  @Inject(CONSTANTS.MODELS_NAME)
  modelName: string;

  @Inject()
  logger: Logger;

  public readonly primaryKey: string = 'id';
  public includes: IncludeOptions[] = [];
  public excludes: string[] = [];

  public async getByPk(key: number | string): Promise<Result<ItemApiResponse<M>, BaseResponse>> {
    try {
      const data = await this.findByPk(key);
      if (data) {
        return ok({ success: true, data });
      } else {
        return err({
          success: false,
          errorOrigin: ErrorOrigin.CLIENT,
          message: `No ${this.modelName} with such id`
        });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getPage(
    pageQuery: PageQuery,
    OrganizationId?: number
  ): Promise<Result<CollectionApiResponse<M>, BaseResponse>> {
    try {
      const { limit, offset, sortDirection, sortIndex, parsedFilters } = pageQuery;

      const data = await this.MODEL.findAndCountAll({
        where: {
          ...parsedFilters,
          ...(OrganizationId && { OrganizationId })
        },
        include: [...this.includes],
        limit,
        offset,
        order: [[sortIndex, sortDirection]],
        distinct: true
      });

      if (data.count) {
        const pages = Math.ceil(data.count / limit);
        const ids: number[] = data.rows.map((dep) => dep[this.primaryKey]);
        return ok({ success: true, ids, data: data.rows, resultsNum: data.count, pages });
      } else {
        return ok({ success: false, message: `No ${this.modelName}s by this query`, data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(item: C): Promise<Result<ItemApiResponse<M>, BaseResponse>> {
    try {
      const createdItem = await this.MODEL.create({
        ...item
      });
      const data = await this.postAction(item, createdItem[this.primaryKey]);
      return ok({ success: true, message: `New ${this.modelName} created successfully!`, data });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async update(item: A): Promise<Result<ItemApiResponse<M>, BaseResponse>> {
    try {
      const [number] = await this.MODEL.update(
        {
          ...item
        },
        {
          where: { [this.primaryKey]: item[this.primaryKey] } as WhereOptions<M['_attributes']>
        }
      );

      if (number > 0) {
        const data = await this.postAction(item, item[this.primaryKey]);
        return ok({ success: true, message: `The ${this.modelName} updated successfully!`, data });
      } else {
        return err({
          success: false,
          errorOrigin: ErrorOrigin.CLIENT,
          message: `No ${this.modelName}s by this query`
        });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(key: string | number | string[] | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const deleted = await this.MODEL.destroy({
        where: { [this.primaryKey]: key } as WhereOptions<M['_attributes']>
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} ${this.modelName}(s)` });
      } else {
        return err({
          success: false,
          errorOrigin: ErrorOrigin.CLIENT,
          message: `No ${this.modelName}s by this query`
        });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public postAction(_: C | A | M, key: string | number): Promise<M> {
    return this.findByPk(key);
  }

  public findByPk(key: number | string): Promise<M> {
    return this.MODEL.findByPk(key, {
      attributes: { exclude: [...this.excludes] },
      include: [...this.includes]
    });
  }
}
