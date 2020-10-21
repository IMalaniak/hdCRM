export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface CollectionApiResponse<T> extends BaseResponse {
  resultsNum?: number;
  pages?: number;
  data: T[] | T;
}

export interface ItemApiResponse<T> extends BaseResponse {
  data: T;
}

export interface ApiResponse<T> {
  statusCode: number;
  body: T;
}
