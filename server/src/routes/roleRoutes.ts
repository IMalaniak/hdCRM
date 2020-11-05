import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { RoleController } from '../controllers';

import {
  Role,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithBody,
  CollectionQuery,
  RequestWithQuery,
  RoleCreationAttributes
} from '../models';

@Service()
export class RoleRoutes {
  private router: Router = Router();

  constructor(private readonly roleController: RoleController) {}

  public register(): Router {
    this.router.get('/dashboard', (req: Request, res: Response<CollectionApiResponse<Role>>) =>
      this.roleController.getDashboardData(req, res)
    );

    this.router.post('/', (req: RequestWithBody<RoleCreationAttributes>, res: Response<ItemApiResponse<Role>>) =>
      this.roleController.create(req, res)
    );

    this.router.get('/', (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Role>>) =>
      this.roleController.getPage(req, res)
    );

    this.router.get('/:id', (req: Request<{ id: string }>, res: Response<ItemApiResponse<Role>>) =>
      this.roleController.getDataById(req, res)
    );

    this.router.put('/:id', (req: RequestWithBody<Role>, res: Response<ItemApiResponse<Role>>) =>
      this.roleController.updateOne(req, res)
    );

    this.router.delete('/:id', (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.roleController.delete(req, res)
    );

    return this.router;
  }
}
