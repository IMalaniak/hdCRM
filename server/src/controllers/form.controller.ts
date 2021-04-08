import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { Form, FormAttributes } from '../models';
import { FormService } from '../services';
import { BaseController } from './base/base.controller';

@Service()
export class FormController extends BaseController<FormAttributes, FormAttributes, Form> {
  constructor(protected readonly dataBaseService: FormService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_FORM);
  }
}
