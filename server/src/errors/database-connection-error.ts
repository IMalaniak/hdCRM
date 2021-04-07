import { StatusCodes } from 'http-status-codes';

import { CONSTANTS } from '../constants';
import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor() {
    super(CONSTANTS.TEXTS_DATABASE_ERROR);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
