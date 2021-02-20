import { Service } from 'typedi';

import { Form, FormAttributes } from '../models';
import { FormService } from '../services';
import { BaseController } from './base/BaseController';

@Service()
export class FormController extends BaseController<FormAttributes, FormAttributes, Form> {
  constructor(readonly dataBaseService: FormService) {
    super();
  }
}
