import { Request, Response } from 'express';
import { Service } from 'typedi';

import { BaseResponse, Form, FormAttributes, ItemApiResponse, RequestWithBody } from '../models';
import { FormService } from '../services';
import { sendResponse } from './utils';

@Service()
export class FormController {
  constructor(private readonly formService: FormService) {}

  public async getBy(
    req: Request<{ formName: string }>,
    res: Response<ItemApiResponse<Form> | BaseResponse>
  ): Promise<void> {
    const {
      params: { formName }
    } = req;
    const result = await this.formService.getBy(formName);

    return sendResponse<ItemApiResponse<Form>, BaseResponse>(result, res);
  }

  public async create(
    req: RequestWithBody<FormAttributes>,
    res: Response<ItemApiResponse<Form> | BaseResponse>
  ): Promise<void> {
    const result = await this.formService.create(req.body);

    return sendResponse<ItemApiResponse<Form>, BaseResponse>(result, res);
  }

  public async delete(req: Request<{ id: string }>, res: Response<BaseResponse>): Promise<void> {
    const {
      params: { id }
    } = req;
    const result = await this.formService.delete(id);

    return sendResponse<BaseResponse, BaseResponse>(result, res);
  }
}
