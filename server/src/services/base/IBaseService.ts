import { Result } from 'neverthrow';
import { Model } from 'sequelize';
import { CollectionApiResponse, BaseResponse, ItemApiResponse, PageQueryWithOrganization } from '../../models';

export interface IdItem {
  id: number;
}

export interface OrgIdItem {
  OrganizationId: number;
}

export interface IBaseService<C, A extends IdItem & OrgIdItem, M extends Model<A, C>> {
  getByPk: (id: number | string) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  getPage: (pageQuery: PageQueryWithOrganization) => Promise<Result<CollectionApiResponse<M>, BaseResponse>>;
  create: (item: C) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  update: (item: A) => Promise<Result<ItemApiResponse<M>, BaseResponse>>;
  delete: (id: string | number | string[] | number[]) => Promise<Result<BaseResponse, BaseResponse>>;
}
