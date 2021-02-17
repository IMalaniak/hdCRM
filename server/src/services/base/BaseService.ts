import { err, ok, Result } from 'neverthrow';
import { IncludeOptions, Model } from 'sequelize';
import { Inject } from 'typedi';

import { CONSTANTS } from '../../constants';
import {
  BaseResponse,
  CollectionApiResponse,
  ErrorOrigin,
  ItemApiResponse,
  PageQueryWithOrganization
} from '../../models';
import { Logger } from '../../utils/Logger';
import { IBaseService, IdItem, OrgIdItem } from './IBaseService';

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = new () => T;
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

export abstract class BaseService<C, A extends IdItem & OrgIdItem, M extends Model<A, C> & IdItem>
  implements IBaseService<C, A, M> {
  @Inject(CONSTANTS.MODEL)
  MODEL: NonAbstractTypeOfModel<M>;

  @Inject(CONSTANTS.MODELS_NAME)
  modelName: string;

  @Inject()
  logger: Logger;

  public abstract readonly includes: IncludeOptions[];
  public abstract excludes: string[];

  public async getById(id: number | string): Promise<Result<ItemApiResponse<M>, BaseResponse>> {
    try {
      const data = await this.findByPk(id);
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

  public async getPage(pageQuery: PageQueryWithOrganization): Promise<Result<CollectionApiResponse<M>, BaseResponse>> {
    try {
      const { limit, offset, sortDirection, sortIndex, OrganizationId, parsedFilters } = pageQuery;

      const data = await this.MODEL.findAndCountAll({
        where: {
          ...parsedFilters,
          OrganizationId
        },
        include: [...this.includes],
        limit,
        offset,
        order: [[sortIndex, sortDirection]],
        distinct: true
      });

      if (data.count) {
        const pages = Math.ceil(data.count / limit);
        const ids: number[] = data.rows.map((dep) => dep.id);
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
      const data = await this.sideEffect(item, createdItem.id);
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
          where: { id: item.id }
        }
      );

      if (number > 0) {
        const data = await this.sideEffect(item, item.id);
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

  public async delete(id: string | number | string[] | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const deleted = await this.MODEL.destroy({
        where: { id }
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

  public abstract sideEffect(item: C | A | M, id: number): Promise<M>;

  public findByPk(id: number | string): Promise<M> {
    return this.MODEL.findByPk(id, {
      attributes: { exclude: [...this.excludes] },
      include: [...this.includes]
    });
  }
}
