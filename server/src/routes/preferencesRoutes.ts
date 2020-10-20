import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import { Service } from 'typedi';

import { Preference, RequestWithBody, ApiResponse } from '../models';

@Service()
export class PreferenceRoutes {
  private router: Router = Router();

  public register(): Router {
    this.router.get('/', (_, res: Response) => {
      // Logger.Info(`Selecting preferences list...`);
      try {
        const preferencesList = Object.keys(Preference.rawAttributes)
          .filter((key) => Preference.rawAttributes[key].values)
          .reduce((acc, key) => {
            return {
              ...acc,
              [key]: Preference.rawAttributes[key].values
            };
          }, {});

        res.status(StatusCodes.OK).json(preferencesList);
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post(
      '/',
      async (req: RequestWithBody<Partial<Preference>>, res: Response<Preference | ApiResponse>) => {
        // Logger.Info(`Setting user preferences, userId: ${req.user.id}`);
        const user = req.user;
        const userPreference = await user.getPreference();
        try {
          const response = userPreference
            ? await userPreference.update(req.body)
            : await req.user.createPreference(req.body);
          res.status(StatusCodes.OK).json(response);
        } catch (error) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'Sorry, there was some problem setting preferences' });
        }
      }
    );

    return this.router;
  }
}
