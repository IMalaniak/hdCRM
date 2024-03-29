import { StatusCodes } from 'http-status-codes';

import { CONSTANTS } from '../constants';
import { ErrorResponse } from '../models';

import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor() {
    super(CONSTANTS.TEXTS_API_GENERIC_ERROR);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return { message: this.message };
  }
}
