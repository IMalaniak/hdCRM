import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';

import { BaseResponse, Form, ItemApiResponse, FormAttributes, ErrorOrigin } from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class FormService {
  constructor(private readonly logger: Logger) {}

  public async getBy(key: string): Promise<Result<ItemApiResponse<Form>, BaseResponse>> {
    try {
      const form = await Form.findByPk(key);
      if (form) {
        return ok({ success: true, data: form });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No form with such key', data: null });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(form: FormAttributes): Promise<Result<ItemApiResponse<Form>, BaseResponse>> {
    try {
      const data = await Form.create(form);
      if (data) {
        return ok({ success: true, message: 'Form created successfully!', data });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(key: string | string[]): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const deleted = await Form.destroy({
        where: { key }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} form` });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No forms by this query', data: null });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
