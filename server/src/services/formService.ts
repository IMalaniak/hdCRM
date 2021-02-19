import Container, { Service } from 'typedi';

import { Form, FormAttributes } from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';
import { IncludeOptions } from 'sequelize/types';

@Service()
export class FormService extends BaseService<FormAttributes, FormAttributes, Form> {
  public readonly primaryKey = 'key';
  public includes: IncludeOptions[] = [];
  public excludes: string[] = [];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Form);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_FORM);
  }

  public sideEffect(_, key: number): Promise<Form> {
    return this.findByPk(key);
  }
}
