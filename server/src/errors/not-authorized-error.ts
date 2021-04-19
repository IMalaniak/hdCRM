import { StatusCodes } from 'http-status-codes';

import { CONSTANTS } from '../constants';
import { ErrorResponse } from '../models';

import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(customMessage?: string) {
    super(customMessage ?? CONSTANTS.TEXTS_NOT_AUTHORIZED_ERROR);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return { message: this.message };
  }
}
