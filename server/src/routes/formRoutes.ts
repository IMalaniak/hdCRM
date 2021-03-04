import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { ItemApiResponse, RequestWithBody, FormAttributes, Form } from '../models';
import { FormController } from '../controllers';

@Service()
export class FormRoutes {
  private router: Router = Router();

  constructor(private readonly formController: FormController) {}

  public register(): Router {
    this.router.get('/:id', async (req: Request<{ id: string }>, res: Response<ItemApiResponse<Form>>) =>
      this.formController.getByPk(req, res)
    );

    this.router.post('/', async (req: RequestWithBody<FormAttributes>, res: Response<ItemApiResponse<Form>>) =>
      this.formController.create(req, res)
    );

    return this.router;
  }
}
