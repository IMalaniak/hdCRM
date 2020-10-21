export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface CollectionApiResponse<T> extends ApiResponse {
  resultsNum?: number;
  pages?: number;
  ids?: number[];
  data: T[];
}

export interface ItemApiResponse<T> extends ApiResponse {
  data: T;
}
