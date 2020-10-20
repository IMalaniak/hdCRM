import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { ItemApiResponse, RequestWithBody, RequestWithQuery, FormAttributes } from '../models';
import { FormController } from '../controllers';

@Service()
export class FormRoutes {
  private router: Router = Router();

  constructor(private readonly formController: FormController) {}

  public register(): Router {
    this.router.get(
      '/:formName',
      async (req: RequestWithQuery<{ formName: string }>, res: Response<ItemApiResponse<FormAttributes>>) => {
        const { formName } = req.params;
        // Logger.Info(`Selecting ${formName} form...`);

        try {
          const data = await this.formController.getByFormName(formName);
          res.status(StatusCodes.OK).json({ success: true, data });
        } catch (error) {
          // Logger.Err(error);
          return res.status(StatusCodes.BAD_REQUEST).json(error);
        }
      }
    );

    this.router.post(
      '/',
      async (req: RequestWithBody<FormAttributes>, res: Response<ItemApiResponse<FormAttributes>>) => {
        const form = req.body;
        // Logger.Info(`Creating new form with key: ${form.key}...`);

        try {
          const formData = await this.formController.create(form);
          res.status(StatusCodes.OK).json({ success: true, data: formData });
        } catch (error) {
          // Logger.Err(error);
          return res.status(StatusCodes.BAD_REQUEST).json(error);
        }
      }
    );

    return this.router;
  }
}
