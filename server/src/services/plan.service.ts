import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { IncludeOptions, IncludeThroughOptions, Op, Sequelize } from 'sequelize';
import { Result, ok, err } from 'neverthrow';
import Container, { Service } from 'typedi';

import { BaseResponse, ItemApiResponse } from '../models';
import { CONSTANTS } from '../constants';
import { CustomError, InternalServerError, NotFoundError } from '../errors';
import {
  PlanCreationAttributes,
  PlanAttributes,
  Plan,
  User,
  AssetCreationAttributes,
  Asset,
  Stage
} from '../repositories';

import { BaseService } from './base/base.service';

@Service()
export class PlanService extends BaseService<PlanCreationAttributes, PlanAttributes, Plan> {
  private readonly unlinkAsync = promisify(fs.unlink);

  protected readonly includes: IncludeOptions[] = [
    {
      model: User,
      as: 'Creator',
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Asset,
          as: 'avatar'
        }
      ]
    },
    {
      model: User,
      as: 'Participants',
      attributes: { exclude: ['password'] },
      through: {
        attributes: []
      },
      include: [
        {
          model: Asset,
          as: 'avatar'
        }
      ]
    },
    {
      model: Asset,
      as: 'Documents',
      through: {
        attributes: []
      }
    },
    {
      model: Stage,
      as: 'activeStage'
    },
    {
      model: Stage,
      as: 'Stages',
      through: {
        as: 'Details',
        attributes: { exclude: ['PlanId', 'StageId'] }
      } as IncludeThroughOptions,
      order: [Sequelize.col('order')]
    }
  ];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Plan);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_PLAN);
  }

  public async addDocument(params: {
    document: AssetCreationAttributes;
    planId: string;
  }): Promise<Result<ItemApiResponse<Asset>, CustomError>> {
    try {
      const { document, planId } = params;

      const plan = await Plan.findByPk(planId, {
        attributes: ['id']
      });

      if (!plan) {
        return err(new NotFoundError('Plan not found!'));
      }

      const doc = await plan.createDocument(document as any);

      return ok({
        message: 'Doccument added!',
        data: doc
      });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async deleteDocument(id: string): Promise<Result<BaseResponse, CustomError>> {
    try {
      const docToBeDeleted = await Asset.findByPk(id);

      if (docToBeDeleted) {
        const destination =
          path.join(__dirname, '../../uploads') + docToBeDeleted.location + '/' + docToBeDeleted.title;
        await this.unlinkAsync(destination);

        await docToBeDeleted.destroy();

        return ok({ message: 'Document deleted successfully!' });
      } else {
        return err(new InternalServerError());
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  protected async postAction(plan: Plan, id: number): Promise<Plan> {
    // TODO: refactor this
    if (!plan.Stages) {
      const stages = await Stage.findAll({
        where: {
          keyString: {
            [Op.or]: ['created', 'inProgress', 'finished']
          }
        }
      });

      if (stages.length) {
        /* eslint-disable */
        stages.forEach(async (stage, i) => {
          if (stage.keyString === 'created') {
            ((await Plan.findByPk(id, {
              attributes: ['id']
            })) as Plan).setActiveStage(stage);
          }
          await ((await Plan.findByPk(id, {
            attributes: ['id']
          })) as Plan).addStage(stage, {
            through: {
              order: i,
              completed: false
            }
          });
        });
        /* eslint-enable */
      }
    }

    if (plan.Participants) {
      const users = await User.findAll({
        where: {
          [Op.or]: plan.Participants as { id: number }[]
        }
      });
      await ((await Plan.findByPk(id, {
        attributes: ['id']
      })) as Plan).setParticipants(users);
    }
    return this.findByPk(id) as Promise<Plan>;
  }
}
