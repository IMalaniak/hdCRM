import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
