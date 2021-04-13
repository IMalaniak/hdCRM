import { Request, Response } from 'express';
import { Service } from 'typedi';

import { BaseResponse, CollectionApiResponse, ItemApiResponse, RequestWithBody } from '../models';
import { PrivilegeService } from '../services';
import { CustomError } from '../errors';
import { PrivilegeCreationAttributes, Privilege } from '../repositories';

import { sendResponse } from './utils';

@Service()
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | BaseResponse>): Promise<void> {
    req.log.info(`Selecting privileges list...`);

    const result = await this.privilegeService.getAll();

    return sendResponse<CollectionApiResponse<any> | BaseResponse, CustomError>(result, res);
  }

  public async create(
    req: RequestWithBody<PrivilegeCreationAttributes>,
    res: Response<ItemApiResponse<Privilege> | BaseResponse>
  ): Promise<void> {
    req.log.info(`Creating new privilege...`);

    const result = await this.privilegeService.create(req.body);

    return sendResponse<ItemApiResponse<Privilege>, CustomError>(result, res);
  }
}
