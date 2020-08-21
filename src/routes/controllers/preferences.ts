import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { Preference } from '../../models';
import Passport from '../../config/passport';
import { RequestWithBody } from 'src/models/apiRequest';
import { ApiResponse } from 'src/models/apiResponse';

@Controller('preferences/')
export class PreferenceController {
  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(_, res: Response) {
    Logger.Info(`Selecting preferences list...`);
    try {
      const preferencesList = Object.keys(Preference.rawAttributes)
        .filter(key => Preference.rawAttributes[key].values)
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: Preference.rawAttributes[key].values
          };
        }, {});

      res.status(OK).json(preferencesList);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private async setPreference(req: RequestWithBody<Partial<Preference>>, res: Response<Preference | ApiResponse>) {
    Logger.Info(`Setting user preferences, userId: ${req.user.id}`);
    const user = req.user;
    const userPreference = await user.getPreference();
    try {
      const response = userPreference
        ? await userPreference.update(req.body)
        : await req.user.createPreference(req.body);
      res.status(OK).json(response);
    } catch (error) {
      res.status(BAD_REQUEST).json({ success: false, message: 'Sorry, there was some problem setting preferences' });
    }
  }
}
