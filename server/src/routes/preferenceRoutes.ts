import { Response, Router } from 'express';
import { Service } from 'typedi';

import { Preference, RequestWithBody, PreferenceCreationAttributes, ItemApiResponse } from '../models';
import { PreferenceController } from '../controllers';
import { CustomError } from '../errors';

@Service()
export class PreferenceRoutes {
  private router: Router = Router();

  constructor(private readonly preferenceController: PreferenceController) {}

  public register(): Router {
    this.router.get('/', async (req, res: Response) => this.preferenceController.getAll(req, res));

    this.router.post(
      '/',
      async (
        req: RequestWithBody<PreferenceCreationAttributes>,
        res: Response<ItemApiResponse<Preference> | CustomError>
      ) => this.preferenceController.set(req, res)
    );

    return this.router;
  }
}
