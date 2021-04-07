import { Request, Response, Router } from 'express';
import { Model } from 'sequelize';

import { BaseController } from '../../controllers/base/baseController';
import { CustomError } from '../../errors';
import {
  ItemApiResponse,
  BaseResponse,
  RequestWithQuery,
  CollectionQuery,
  CollectionApiResponse,
  RequestWithBody
} from '../../models';

export abstract class BaseRoutes<C, A, M extends Model<A, C>> {
  protected readonly router: Router = Router();

  protected readonly routesController: BaseController<C, A, M>;

  public register(): Router {
    this.buildBaseRouter();
    return this.router;
  }

  protected buildBaseRouter(): void {
    this.router.get('/:id', async (req: Request<{ id: string }>, res: Response<ItemApiResponse<M> | CustomError>) =>
      this.routesController.getByPk(req, res)
    );

    this.router.get(
      '/',
      async (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<M> | CustomError>) =>
        this.routesController.getPage(req, res)
    );

    this.router.post('/', async (req: RequestWithBody<C>, res: Response<ItemApiResponse<M> | CustomError>) =>
      this.routesController.create(req, res)
    );

    this.router.put('/:id', async (req: RequestWithBody<A>, res: Response<ItemApiResponse<M> | CustomError>) =>
      this.routesController.update(req, res)
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse | CustomError>) =>
      this.routesController.delete(req, res)
    );
  }
}
