import { Response } from 'express';
import { Service } from 'typedi';

import {
  BaseResponse,
  CollectionApiResponse,
  ItemApiResponse,
  Privilege,
  PrivilegeCreationAttributes,
  RequestWithBody
} from '../models';
import { sendResponse } from './utils';
import { PrivilegeService } from '../services';

@Service()
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  public async getAll(res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    const result = await this.privilegeService.getAll();

    return sendResponse<CollectionApiResponse<any>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<PrivilegeCreationAttributes>,
    res: Response<ItemApiResponse<Privilege> | BaseResponse>
  ): Promise<void> {
    const result = await this.privilegeService.create(req.body);

    return sendResponse<ItemApiResponse<Privilege>, BaseResponse>(result, res);
  }
}
