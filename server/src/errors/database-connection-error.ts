import { CONSTANTS } from '../constants';
import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super(CONSTANTS.TEXTS_DATABASE_ERROR);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
