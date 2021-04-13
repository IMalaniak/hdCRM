/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseResponse } from '../models';
import { FileController } from '../controllers';
import { Asset } from '../repositories';

@Service()
export class FileRoutes {
  private readonly router: Router = Router();

  constructor(private readonly fileController: FileController) {}

  public register(): Router {
    this.router.get(
      '/download/:fileID',
      async (req: Request<{ fileID: string }>, res: Response<Asset | BaseResponse>) =>
        this.fileController.download(req, res)
    );

    return this.router;
  }
}
