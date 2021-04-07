import { Request, Response } from 'express';
import { Service } from 'typedi';

import { ItemApiResponse, Preference, PreferenceCreationAttributes, RequestWithBody } from '../models';
import { sendResponse } from './utils';
import { PreferenceService } from '../services/preferenceService';
import { CustomError } from '../errors';

@Service()
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  public async getAll(req: Request, res: Response<ItemApiResponse<any> | CustomError>): Promise<void> {
    req.log.info(`Selecting preferences list...`);

    const result = await this.preferenceService.getAll();

    return sendResponse<ItemApiResponse<any>, CustomError>(result, res);
  }

  public async set(
    req: RequestWithBody<PreferenceCreationAttributes>,
    res: Response<ItemApiResponse<Preference> | CustomError>
  ): Promise<void> {
    req.log.info(`Setting user preferences, userId: ${req.user.id}`);

    const result = await this.preferenceService.set(req.user, req.body);

    return sendResponse<ItemApiResponse<Preference>, CustomError>(result, res);
  }
}
