import { Request, Response } from 'express';
import { Service } from 'typedi';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

import { Asset, BaseResponse } from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class FileController {
  private destination = path.join(__dirname, '../uploads');

  public async download(req: Request<{ fileID: string }>, res: Response<Asset | BaseResponse>): Promise<void> {
    const {
      params: { fileID }
    } = req;

    // Logger.Info(`Selecting file by id: ${req.params.fileID}...`);
    try {
      const file = await Asset.findByPk(fileID);
      if (file) {
        const filepath = this.destination + file.location + '/' + file.title;
        res.download(filepath);
      } else {
        res.status(StatusCodes.NOT_FOUND);
        res.send({ success: false, message: 'Sorry, file not found...' });
      }
    } catch (error) {
      // Logger.Err(err);
      res.status(StatusCodes.BAD_REQUEST);
      res.send({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
