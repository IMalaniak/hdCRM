import { Service } from 'typedi';

import { BaseRoutes } from './base/base.routes';
import { FormAttributes, Form } from '../models';
import { FormController } from '../controllers';

@Service()
export class FormRoutes extends BaseRoutes<FormAttributes, FormAttributes, Form> {
  constructor(protected readonly routesController: FormController) {
    super();
  }
}
