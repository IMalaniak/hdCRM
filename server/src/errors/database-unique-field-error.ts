import { StatusCodes } from 'http-status-codes';
import { UniqueConstraintError } from 'sequelize/types';

import { ErrorResponse } from '../models';

import { CustomError } from './custom-error';

export class DatabaseUniqueFieldError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public error: UniqueConstraintError) {
    super(error.message);

    Object.setPrototypeOf(this, DatabaseUniqueFieldError.prototype);
  }

  serializeErrors(): ErrorResponse {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = this.error.errors[0]!;
    return { message: error.message, field: error.path };
  }
}
