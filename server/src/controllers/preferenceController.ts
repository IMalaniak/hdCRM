import { Response } from 'express';
import { Service } from 'typedi';

import { BaseResponse, ItemApiResponse, Preference, PreferenceCreationAttributes, RequestWithBody } from '../models';
import { sendResponse } from './utils';
import { PreferenceService } from '../services/preferenceService';

@Service()
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  public async getAll(res: Response<ItemApiResponse<any> | BaseResponse>): Promise<void> {
    const result = await this.preferenceService.getAll();

    return sendResponse<ItemApiResponse<any>, BaseResponse>(result, res);
  }

  public async set(
    req: RequestWithBody<PreferenceCreationAttributes>,
    res: Response<ItemApiResponse<Preference> | BaseResponse>
  ): Promise<void> {
    const result = await this.preferenceService.set(req.user, req.body);

    return sendResponse<ItemApiResponse<Preference>, BaseResponse>(result, res);
  }
}
