import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';

import { CustomError } from '../../errors/custom-error';
import { BaseResponse } from '../../models';

interface DataType {
  data?: unknown;
}

export function sendResponse<OK extends BaseResponse & DataType, ERR extends CustomError>(
  result: Result<OK, ERR>,
  res: Response<OK | BaseResponse>
): void {
  return result.match<void>(
    (body) => {
      res.status(body.message || Boolean(body.data) ? StatusCodes.OK : StatusCodes.NO_CONTENT);
      res.send(body);
    },
    (error) => {
      res.status(error.statusCode);
      res.send(error.serializeErrors());
    }
  );
}
