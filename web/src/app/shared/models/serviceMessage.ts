export interface ServiceMessage {
  readonly success: boolean;
  readonly message: string;
}

export interface CollectionServiceMessage<T> extends ServiceMessage {
  readonly resultsNum?: number;
  readonly pages?: number;
  readonly data: T[];
}

export interface ItemServiceMessage<T> extends ServiceMessage {
  readonly data: T;
}
