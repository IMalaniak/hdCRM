import { Service } from 'typedi';

import { BaseRoutes } from './base/base.routes';
import { StageController } from '../controllers';
import { StageCreationAttributes, StageAttributes, Stage } from '../repositories';

@Service()
export class StageRoutes extends BaseRoutes<StageCreationAttributes, StageAttributes, Stage> {
  constructor(protected readonly routesController: StageController) {
    super();
  }
}
