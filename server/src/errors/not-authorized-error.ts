import { CONSTANTS } from '../constants';
import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super(CONSTANTS.TEXTS_NOT_AUTHORIZED_ERROR);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
