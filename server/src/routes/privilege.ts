import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { Privilege, RequestWithBody, CollectionApiResponse, ItemApiResponse } from '../models';

@Service()
export class PrivilegeRoutes {
  private router: Router = Router();

  public register(): Router {
    this.router.post('/', (req: RequestWithBody<Partial<Privilege>>, res: Response<ItemApiResponse<Privilege>>) => {
      // Logger.Info(`Creating new privilege...`);
      Privilege.create({
        keyString: req.body.keyString,
        title: req.body.title
      })
        .then((privilege) => {
          return res
            .status(StatusCodes.OK)
            .json({ success: true, message: 'Privilege is created successfully!', data: privilege });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.get('/', (_, res: Response<CollectionApiResponse<Privilege>>) => {
      // Logger.Info(`Selecting privileges list...`);
      Privilege.findAndCountAll()
        .then((data) => {
          return res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    return this.router;
  }
}
