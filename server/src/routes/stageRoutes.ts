import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import {
  Stage,
  RequestWithBody,
  CollectionApiResponse,
  ItemApiResponse,
  StageCreationAttributes,
  Plan
} from '../models';

@Service()
export class StageRoutes {
  private router: Router = Router();

  public register(): Router {
    this.router.post('/', (req: RequestWithBody<StageCreationAttributes>, res: Response<ItemApiResponse<Stage>>) => {
      // Logger.Info(`Creating new stage...`);
      Stage.create({
        ...req.body
      })
        .then((stage) => {
          return res.status(StatusCodes.OK).json({ success: true, message: 'Stage created successfull!', data: stage });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.get('/', (req: Request, res: Response<CollectionApiResponse<Stage>>) => {
      // Logger.Info(`Selecting stages list...`);
      Stage.findAndCountAll({
        include: [
          {
            model: Plan as any,
            where: {
              OrganizationId: req.user.OrganizationId
            },
            attributes: ['id']
          }
        ]
      })
        .then((data) => {
          return res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.toString());
        });
    });

    return this.router;
  }
}
