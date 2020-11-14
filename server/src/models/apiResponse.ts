export interface BaseResponse {
  success: boolean;
  message?: string;
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
