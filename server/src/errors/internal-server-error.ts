import { CONSTANTS } from '../constants';
import { BaseResponse } from '../models';
import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
  statusCode = 500;

  constructor() {
    super(CONSTANTS.TEXTS_API_GENERIC_ERROR);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors(): BaseResponse {
    return { message: this.message };
  }
}
