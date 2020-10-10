import { StatusCodes } from 'http-status-codes';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import Passport from '../../config/passport';
import { RequestWithBody, RequestWithQuery } from '../../models/apiRequest';
import { ItemApiResponse } from '../../models/apiResponse';
import { FormAttributes } from '../../models/Form';
import { FormDBController } from '../../dbControllers/formsController';

@Controller('forms/')
export class FormController {
  private readonly formDbCtrl = new FormDBController();

  @Get(':formName')
  @Middleware([Passport.authenticate()])
  async getOne(req: RequestWithQuery<{ formName: string }>, res: Response<ItemApiResponse<FormAttributes>>) {
    const { formName } = req.params;
    Logger.Info(`Selecting ${formName} form...`);

    try {
      const data = await this.formDbCtrl.getByFormName(formName);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      Logger.Err(error);
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  async create(req: RequestWithBody<FormAttributes>, res: Response<ItemApiResponse<FormAttributes>>) {
    const form = req.body;
    Logger.Info(`Creating new form with key: ${form.key}...`);

    try {
      const formData = await this.formDbCtrl.create(form);
      res.status(StatusCodes.OK).json({ success: true, data: formData });
    } catch (error) {
      Logger.Err(error);
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
}
