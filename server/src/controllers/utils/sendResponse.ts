import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';

import { BaseResponse, ErrorOrigin } from '../../models';

export function sendResponse<OK extends BaseResponse, ERR extends BaseResponse>(
  result: Result<OK, ERR>,
  res: Response<OK | ERR>
): void {
  return result.match<void>(
    (body) => {
      res.status(body.success ? StatusCodes.OK : StatusCodes.NO_CONTENT);
      res.send(body);
    },
    (error) => {
      res.status(error.errorOrigin === ErrorOrigin.CLIENT ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST);
      res.send(error);
    }
  );
}
