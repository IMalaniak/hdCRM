import { Request, Response, Router } from 'express';
import { Service } from 'typedi/decorators/Service';

import {
  Department,
  BaseResponse,
  CollectionApiResponse,
  ItemApiResponse,
  CollectionQuery,
  RequestWithQuery,
  RequestWithBody,
  DepartmentCreationAttributes
} from '../models';
import { DepartmentController } from '../controllers/departmentController';

@Service()
export class DepartmentRoutes {
  private router: Router = Router();

  constructor(private readonly departmentController: DepartmentController) {}

  public register(): Router {
    this.router.get(
      '/dashboard',
      async (req: Request, res: Response<CollectionApiResponse<Department> | BaseResponse>) => {
        const result = await this.departmentController.getDashboardData(req);
        res.status(result.statusCode);
        res.send(result.body);
      }
    );

    this.router.get(
      '/:id',
      async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Department> | BaseResponse>) => {
        const result = await this.departmentController.getDataById(req);
        res.status(result.statusCode);
        res.send(result.body);
      }
    );

    this.router.get(
      '/',
      async (
        req: RequestWithQuery<CollectionQuery>,
        res: Response<CollectionApiResponse<Department> | BaseResponse>
      ) => {
        const result = await this.departmentController.getPage(req);
        res.status(result.statusCode);
        res.send(result.body);
      }
    );

    this.router.post(
      '/',
      async (
        req: RequestWithBody<DepartmentCreationAttributes>,
        res: Response<ItemApiResponse<Department> | BaseResponse>
      ) => {
        const result = await this.departmentController.create(req);
        res.status(result.statusCode);
        res.send(result.body);
      }
    );

    this.router.put(
      '/:id',
      async (req: RequestWithBody<Department>, res: Response<ItemApiResponse<Department> | BaseResponse>) => {
        const result = await this.departmentController.updateOne(req);
        res.status(result.statusCode);
        res.send(result.body);
      }
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) => {
      const result = await this.departmentController.delete(req);
      res.status(result.statusCode);
      res.send(result.body);
    });

    return this.router;
  }
}
