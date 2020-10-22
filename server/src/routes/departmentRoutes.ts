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
      async (req: Request, res: Response<CollectionApiResponse<Department> | BaseResponse>) =>
        this.departmentController.getDashboardData(req, res)
    );

    this.router.get(
      '/:id',
      async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Department> | BaseResponse>) =>
        this.departmentController.getDataById(req, res)
    );

    this.router.get(
      '/',
      async (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Department> | BaseResponse>) =>
        this.departmentController.getPage(req, res)
    );

    this.router.post(
      '/',
      async (
        req: RequestWithBody<DepartmentCreationAttributes>,
        res: Response<ItemApiResponse<Department> | BaseResponse>
      ) => this.departmentController.create(req, res)
    );

    this.router.put(
      '/:id',
      async (req: RequestWithBody<Department>, res: Response<ItemApiResponse<Department> | BaseResponse>) =>
        this.departmentController.updateOne(req, res)
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.departmentController.delete(req, res)
    );

    return this.router;
  }
}
