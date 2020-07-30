import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';

@Controller('preferences/')
export class PreferenceController {
  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(req: Request, res: Response) {
    Logger.Info(`Selecting preferences list...`);
    try {
      const preferencesList = Object.keys(db.Preference.rawAttributes)
        .filter(key => db.Preference.rawAttributes[key].values)
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: db.Preference.rawAttributes[key].values
          };
        }, {});

      res.status(OK).json(preferencesList);
    } catch (error) {
      res.status(BAD_REQUEST).json(error);
    }
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private async setPreference(req: Request, res: Response) {
    Logger.Info(`Setting user preferences, userId: ${req.user.id}`);
    const user = req.user;
    const userPreference = await user.getPreference();
    try {
      const response = userPreference
        ? await userPreference.update(req.body)
        : await req.user.createPreference(req.body);
      res.status(OK).json(response);
    } catch (error) {
      res.status(BAD_REQUEST).json(error);
    }
  }
}
