import { StatusCodes } from 'http-status-codes';

import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
