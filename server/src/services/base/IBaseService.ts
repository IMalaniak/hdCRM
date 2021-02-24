import { Result } from 'neverthrow';
import { Model } from 'sequelize';
import { CollectionApiResponse, BaseResponse, ItemApiResponse, PageQuery } from '../../models';

export interface IBaseService<C, A, M extends Model<A, C>> {
  getByPk: (id: number | string) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  getPage: (pageQuery: PageQuery, OrganizationId?: number) => Promise<Result<CollectionApiResponse<M>, BaseResponse>>;
  create: (item: C) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  update: (item: A) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  delete: (id: string | number | string[] | number[]) => Promise<Result<BaseResponse, BaseResponse>>;
}
