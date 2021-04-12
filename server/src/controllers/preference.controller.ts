import { Request, Response } from 'express';
import { Service } from 'typedi';

import { BaseResponse, ItemApiResponse, RequestWithBody } from '../models';
import { sendResponse } from './utils';
import { PreferenceService } from '../services/preference.service';
import { CustomError } from '../errors';
import { PreferenceCreationAttributes, Preference } from '../repositories';

@Service()
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  public getAll(req: Request, res: Response<ItemApiResponse<any> | BaseResponse>): void {
    req.log.info(`Selecting preferences list...`);

    const result = this.preferenceService.getAll();

    return sendResponse<ItemApiResponse<any> | BaseResponse, CustomError>(result, res);
  }

  public async set(
    req: RequestWithBody<PreferenceCreationAttributes>,
    res: Response<ItemApiResponse<Preference> | BaseResponse>
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.log.info(`Setting user preferences, userId: ${req.user!.id}`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.preferenceService.set(req.user!, req.body);

    return sendResponse<ItemApiResponse<Preference>, CustomError>(result, res);
  }
}
