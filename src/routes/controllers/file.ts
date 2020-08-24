import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Asset } from '../../models';
import Passport from '../../config/passport';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

@Controller('files/')
export class FileController {
  unlinkAsync = promisify(fs.unlink);
  destination = path.join(__dirname, '../../uploads');

  @Get('download/:fileID')
  @Middleware([Passport.authenticate()])
  private get(req: Request<{ fileID: string }>, res: Response) {
    Logger.Info(`Selecting file by id: ${req.params.fileID}...`);
    Asset.findByPk(req.params.fileID)
      .then(file => {
        const filepath = this.destination + file.location + '/' + file.title;
        res.download(filepath);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err.toString());
      });
  }
}
