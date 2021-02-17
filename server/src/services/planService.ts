import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, IncludeThroughOptions, Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import {
  BaseResponse,
  Plan,
  User,
  Asset,
  ItemApiResponse,
  PlanCreationAttributes,
  PlanAttributes,
  Stage,
  Sequelize,
  AssetCreationAttributes
} from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';

@Service()
export class PlanService extends BaseService<PlanCreationAttributes, PlanAttributes, Plan> {
  private unlinkAsync = promisify(fs.unlink);

  public excludes: string[] = [];
  public readonly includes: IncludeOptions[] = [
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

  public async addDocument(params: {
    document: AssetCreationAttributes;
    planId: string;
  }): Promise<Result<ItemApiResponse<Asset>, BaseResponse>> {
    try {
      const { document, planId } = params;

      const plan = await Plan.findByPk(planId, {
        attributes: ['id']
      });

      const doc = await plan.createDocument(document as any);

      return ok({
        success: true,
        message: 'Doccument added!',
        data: doc
      });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async deleteDocument(id: string): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const docToBeDeleted = await Asset.findByPk(id);

      if (docToBeDeleted) {
        const destination =
          path.join(__dirname, '../../uploads') + docToBeDeleted.location + '/' + docToBeDeleted.title;
        this.unlinkAsync(destination);

        await docToBeDeleted.destroy();

        return ok({ success: true, message: 'Document deleted successfully!' });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async sideEffect(plan: Plan, id: number): Promise<Plan> {
    // TODO: refactor this
    if (!plan.Stages) {
      const stages = await Stage.findAll({
        where: {
          keyString: {
            [Op.or]: ['created', 'inProgress', 'finished']
          }
        }
      });

      if (stages) {
        stages.forEach(async (stage, i) => {
          if (stage.keyString === 'created') {
            await (
              await Plan.findByPk(id, {
                attributes: ['id']
              })
            ).setActiveStage(stage);
          }
          await (
            await Plan.findByPk(id, {
              attributes: ['id']
            })
          ).addStage(stage, {
            through: {
              order: i,
              completed: false
            }
          });
        });
      }
    }

    if (plan.Participants) {
      const users = await User.findAll({
        where: {
          [Op.or]: plan.Participants as { id: number }[]
        }
      });
      await (
        await Plan.findByPk(id, {
          attributes: ['id']
        })
      ).setParticipants(users);
    }
    return this.findByPk(id);
  }

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Plan);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_PLAN);
  }
}
