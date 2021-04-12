import { Service } from 'typedi';

import { FormController } from '../controllers';
import { FormAttributes, Form } from '../repositories';

import { BaseRoutes } from './base/base.routes';

@Service()
export class FormRoutes extends BaseRoutes<FormAttributes, FormAttributes, Form> {
  constructor(protected readonly routesController: FormController) {
    super();
  }
}
