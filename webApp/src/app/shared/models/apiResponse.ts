export interface ApiResponse {
  readonly success: boolean;
  readonly message: string;
}

export interface CollectionApiResponse<T> extends ApiResponse {
  readonly resultsNum?: number;
  readonly pages?: number;
  readonly data: T[];
}
export interface ItemApiResponse<T> extends ApiResponse {
  readonly data: T;
}
