import { StatusCodes } from 'http-status-codes';

import { CONSTANTS } from '../constants';
import { BaseResponse } from '../models';

import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(customMessage?: string) {
    super(customMessage ?? CONSTANTS.TEXTS_NOT_AUTHORIZED_ERROR);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
