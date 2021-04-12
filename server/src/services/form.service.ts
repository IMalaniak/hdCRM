import Container, { Service } from 'typedi';

import { Form, FormAttributes } from '../repositories';
import { CONSTANTS } from '../constants';

import { BaseService } from './base/base.service';

@Service()
export class FormService extends BaseService<FormAttributes, FormAttributes, Form> {
  protected readonly primaryKey = 'key';

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Form);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_FORM);
  }
}
