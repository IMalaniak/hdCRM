import { StatusCodes } from 'http-status-codes';

import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
