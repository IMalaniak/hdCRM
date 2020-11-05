import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import {
  Plan,
  Asset,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithQuery,
  CollectionQuery,
  RequestWithBody,
  PlanCreationAttributes
} from '../models';
import uploads from '../multer/multerConfig';
import { PlanController } from '../controllers';

@Service()
export class PlanRoutes {
  private router: Router = Router();

  constructor(private readonly planController: PlanController) {}

  public register(): Router {
    this.router.get('/:id', async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Plan>>) =>
      this.planController.getDataById(req, res)
    );

    this.router.get('/', async (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Plan>>) =>
      this.planController.getPage(req, res)
    );

    this.router.post('/', async (req: RequestWithBody<PlanCreationAttributes>, res: Response<ItemApiResponse<Plan>>) =>
      this.planController.create(req, res)
    );

    this.router.put('/:id', async (req: RequestWithBody<Plan>, res: Response<ItemApiResponse<Plan>>) =>
      this.planController.updateOne(req, res)
    );

    this.router.post(
      '/documents/:planId',
      uploads.single('uploader'),
      // we use single because filepond send file by one
      async (req: Request<{ planId: string }>, res: Response<ItemApiResponse<Asset>>) =>
        this.planController.addDocument(req, res)
    );

    this.router.delete(
      '/documents',
      async (req: RequestWithQuery<{ planId: string; docId: string }>, res: Response<BaseResponse>) =>
        this.planController.deleteDocument(req, res)
    );

    this.router.delete('/:id', async (req: Request<{ id: string }>, res: Response<BaseResponse>) =>
      this.planController.delete(req, res)
    );

    return this.router;
  }
}
