import { Request, Response } from 'express';
import { Service } from 'typedi';

import {
  CollectionApiResponse,
  ItemApiResponse,
  Privilege,
  PrivilegeCreationAttributes,
  RequestWithBody
} from '../models';
import { sendResponse } from './utils';
import { PrivilegeService } from '../services';
import { CustomError } from '../errors';

@Service()
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  public async getAll(req: Request, res: Response<CollectionApiResponse<any> | CustomError>): Promise<void> {
    req.log.info(`Selecting privileges list...`);

    const result = await this.privilegeService.getAll();

    return sendResponse<CollectionApiResponse<any>, CustomError>(result, res);
  }

  public async create(
    req: RequestWithBody<PrivilegeCreationAttributes>,
    res: Response<ItemApiResponse<Privilege> | CustomError>
  ): Promise<void> {
    req.log.info(`Creating new privilege...`);

    const result = await this.privilegeService.create(req.body);

    return sendResponse<ItemApiResponse<Privilege>, CustomError>(result, res);
  }
}
