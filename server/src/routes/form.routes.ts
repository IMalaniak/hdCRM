import { Service } from 'typedi';

import { BaseRoutes } from './base/base.routes';
import { FormController } from '../controllers';
import { FormAttributes, Form } from '../repositories';

@Service()
export class FormRoutes extends BaseRoutes<FormAttributes, FormAttributes, Form> {
  constructor(protected readonly routesController: FormController) {
    super();
  }
}
