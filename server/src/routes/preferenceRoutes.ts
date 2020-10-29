import { Response, Router } from 'express';
import { Service } from 'typedi';

import { Preference, RequestWithBody, BaseResponse, PreferenceCreationAttributes } from '../models';
import { PreferenceController } from '../controllers/preferenceController';

@Service()
export class PreferenceRoutes {
  private router: Router = Router();

  constructor(private readonly preferenceController: PreferenceController) {}

  public register(): Router {
    this.router.get('/', async (_, res: Response) => this.preferenceController.getAll(res));

    this.router.post(
      '/',
      async (req: RequestWithBody<PreferenceCreationAttributes>, res: Response<Preference | BaseResponse>) =>
        this.preferenceController.set(req, res)
    );

    return this.router;
  }
}
