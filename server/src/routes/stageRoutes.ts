import { Service } from 'typedi';

import { BaseRoutes } from './base/baseRoutes';
import { Stage, StageCreationAttributes, StageAttributes } from '../models';
import { StageController } from '../controllers';

@Service()
export class StageRoutes extends BaseRoutes<StageCreationAttributes, StageAttributes, Stage> {
  constructor(protected readonly routesController: StageController) {
    super();
  }
}
