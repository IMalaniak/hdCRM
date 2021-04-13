import { err, ok, Result } from 'neverthrow';
import { IncludeOptions, Model, WhereOptions } from 'sequelize';
import { Inject } from 'typedi';

import { CONSTANTS } from '../../constants';
import { CustomError, InternalServerError, NotFoundError } from '../../errors';
import { BaseResponse, CollectionApiResponse, ItemApiResponse, PageQuery } from '../../models';
import { Logger } from '../../utils/Logger';

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = new () => T;
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

export abstract class BaseService<C, A, M extends Model<A, C>> {
  @Inject(CONSTANTS.MODEL)
  protected MODEL!: NonAbstractTypeOfModel<M>;

  @Inject(CONSTANTS.MODELS_NAME)
  protected modelName!: string;

  @Inject()
  protected logger!: Logger;

  protected readonly primaryKey: string = 'id';
  protected includes: IncludeOptions[] = [];
  protected excludes: string[] = [];

  public async getByPk(key: number | string): Promise<Result<ItemApiResponse<M>, CustomError>> {
    try {
      const data = await this.findByPk(key);
      if (data) {
        return ok({ data });
      } else {
        return err(new NotFoundError(`No ${this.modelName} with such id`));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async getPage(
    pageQuery: PageQuery,
    organizationId?: number
  ): Promise<Result<CollectionApiResponse<M> | BaseResponse, CustomError>> {
    try {
      const { limit, offset, sortDirection, sortIndex, parsedFilters } = pageQuery;

      const data = await this.MODEL.findAndCountAll({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where: {
          ...(parsedFilters as any),
          ...(organizationId && { OrganizationId: organizationId })
        },
        include: [...this.includes],
        limit,
        offset,
        order: [[sortIndex, sortDirection]],
        distinct: true
      });

      if (data.count) {
        const pages = Math.ceil(data.count / limit);
        const ids: number[] = data.rows.map((dep) => (dep as { [key: string]: any })[this.primaryKey] as number);
        return ok({ ids, data: data.rows, resultsNum: data.count, pages });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async create(item: C): Promise<Result<ItemApiResponse<M>, CustomError>> {
    try {
      const createdItem = await this.MODEL.create({
        ...item
      });
      const data = await this.postAction(item, (createdItem as { [key: string]: any })[this.primaryKey]);
      return ok({ message: `New ${this.modelName} created successfully!`, data });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async update(item: A): Promise<Result<ItemApiResponse<M>, CustomError>> {
    try {
      const [num] = await this.MODEL.update(
        {
          ...item
        },
        {
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [this.primaryKey]: (item as { [key: string]: any })[this.primaryKey]
          } as WhereOptions<M['_attributes']>
        }
      );

      if (num > 0) {
        const data = await this.postAction(item, (item as { [key: string]: any })[this.primaryKey]);
        return ok({ message: `The ${this.modelName} updated successfully!`, data });
      } else {
        return err(new NotFoundError(`No ${this.modelName}s by this query`));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async delete(key: string | number | string[] | number[]): Promise<Result<BaseResponse, CustomError>> {
    try {
      const deleted = await this.MODEL.destroy({
        where: { [this.primaryKey]: key } as WhereOptions<M['_attributes']>
      });

      if (deleted > 0) {
        return ok({ message: `Deleted ${deleted} ${this.modelName}(s)` });
      } else {
        return err(new NotFoundError(`No ${this.modelName}s by this query`));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  protected postAction(_: C | A | M, key: string | number): Promise<M> {
    return this.findByPk(key) as Promise<M>;
  }

  protected findByPk(key: number | string): Promise<M | null> {
    return this.MODEL.findByPk(key, {
      attributes: { exclude: [...this.excludes] },
      include: [...this.includes]
    });
  }
}
