export interface BaseResponse {
  message?: string;
  data?: unknown;
}

export interface CollectionApiResponse<T> extends BaseResponse {
  resultsNum?: number;
  pages?: number;
  ids?: number[];
  data: T[];
}

export interface ItemApiResponse<T> extends BaseResponse {
  data: T;
}
