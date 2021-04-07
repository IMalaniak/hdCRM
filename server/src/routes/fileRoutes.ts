import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { Asset } from '../models';
import { FileController } from '../controllers';
import { CustomError } from '../errors';

@Service()
export class FileRoutes {
  private router: Router = Router();

  constructor(private readonly fileController: FileController) {}

  public register(): Router {
    this.router.get('/download/:fileID', async (req: Request<{ fileID: string }>, res: Response<Asset | CustomError>) =>
      this.fileController.download(req, res)
    );

    return this.router;
  }
}
