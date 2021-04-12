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
      association: Plan.associations.Creator,
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          association: User.associations.avatar
        }
      ]
    },
    {
      association: Plan.associations.Participants,
      attributes: { exclude: ['passwordHash', 'salt'] },
      through: {
        attributes: []
      },
      include: [
        {
          association: User.associations.avatar
        }
      ]
    },
    {
      association: Plan.associations.Documents,
      through: {
        attributes: []
      }
    },
    {
      association: Plan.associations.activeStage
    },
    {
      association: Plan.associations.Stages,
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
