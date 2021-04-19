import { StatusCodes } from 'http-status-codes';

import { ErrorResponse } from '../models';

import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return { message: this.message };
  }
}
