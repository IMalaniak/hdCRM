import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export interface CollectionQuery {
  readonly pageSize: string;
  readonly pageIndex: string;
  readonly sortIndex: string;
  readonly sortDirection: string;
}

export type CustomQuery<T> = T & Query;
export interface RequestWithQuery<T> extends Request {
  query: CustomQuery<T>;
}

export interface RequestWithBody<T> extends Request {
  body: T;
}
