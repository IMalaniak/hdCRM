import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import path from 'path';
import { Service } from 'typedi';

import { Asset } from '../models';

@Service()
export class FileRoutes {
  private destination = path.join(__dirname, '../uploads');

  private router: Router = Router();

  public register(): Router {
    this.router.get('/download/:fileID', (req: Request<{ fileID: string }>, res: Response) => {
      // Logger.Info(`Selecting file by id: ${req.params.fileID}...`);
      Asset.findByPk(req.params.fileID)
        .then((file) => {
          const filepath = this.destination + file.location + '/' + file.title;
          res.download(filepath);
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.toString());
        });
    });

    return this.router;
  }
}
