import { Result } from 'neverthrow';
import { Model } from 'sequelize';
import { CustomError } from '../../errors/custom-error';
import { CollectionApiResponse, BaseResponse, ItemApiResponse, PageQuery } from '../../models';

export interface IBaseService<C, A, M extends Model<A, C>> {
  getByPk: (id: number | string) => Promise<Result<ItemApiResponse<M>, CustomError>>;
  getPage: (
    pageQuery: PageQuery,
    OrganizationId?: number
  ) => Promise<Result<CollectionApiResponse<M> | BaseResponse, CustomError>>;
  create: (item: C) => Promise<Result<ItemApiResponse<M>, CustomError>>;
  update: (item: A) => Promise<Result<ItemApiResponse<M>, CustomError>>;
  delete: (id: string | number | string[] | number[]) => Promise<Result<BaseResponse, CustomError>>;
}
