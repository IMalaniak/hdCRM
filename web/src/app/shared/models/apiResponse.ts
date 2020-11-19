import { BaseMessage } from './BaseMessage';

export interface CollectionApiResponse<T> extends BaseMessage {
  readonly resultsNum?: number;
  readonly pages?: number;
  readonly ids?: number[];
  readonly data: T[];
}

export interface ItemApiResponse<T> extends BaseMessage {
  readonly data: T;
}
