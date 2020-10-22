import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Form, ItemApiResponse, FormAttributes } from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class FormService {
  public async getBy(key: number | string): Promise<Result<ItemApiResponse<Form>, BaseResponse>> {
    // Logger.Info(`Selecting form by key: ${key}...`);
    try {
      const form = await Form.findByPk(key);
      if (form) {
        return ok({ success: true, data: form });
      } else {
        return ok({ success: false, message: 'No form with such key', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(form: FormAttributes): Promise<Result<ItemApiResponse<Form>, BaseResponse>> {
    // Logger.Info(`Creating new form...`);
    try {
      const data = await Form.create(form);
      if (data) {
        return ok({ success: true, message: 'Form created successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(key: string | string[]): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Deleting form(s) by key: ${key}...`);
    try {
      const deleted = await Form.destroy({
        where: { key }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} form` });
      } else {
        return ok({ success: false, message: 'No forms by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
