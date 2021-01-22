import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, IncludeThroughOptions, Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import {
  BaseResponse,
  CollectionApiResponse,
  Plan,
  User,
  Asset,
  ItemApiResponse,
  PageQueryWithOrganization,
  PlanCreationAttributes,
  PlanAttributes,
  Stage,
  Sequelize,
  AssetCreationAttributes,
  ErrorOrigin
} from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class PlanService {
  private unlinkAsync = promisify(fs.unlink);

  private includes: IncludeOptions[] = [
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

  constructor(private readonly logger: Logger) {}

  public async getDataById(id: number | string): Promise<Result<ItemApiResponse<Plan>, BaseResponse>> {
    try {
      const plan = await this.findByPk(id);
      if (plan) {
        return ok({ success: true, data: plan });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No plan with such id', data: null });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getPage(
    pageQuery: PageQueryWithOrganization
  ): Promise<Result<CollectionApiResponse<Plan>, BaseResponse>> {
    try {
      const { limit, offset, sortDirection, sortIndex, OrganizationId, parsedFilters } = pageQuery;

      const data = await Plan.findAndCountAll({
        where: {
          ...parsedFilters,
          OrganizationId
        },
        include: [...this.includes],
        limit,
        offset,
        order: [[sortIndex, sortDirection]],
        distinct: true
      });

      if (data.count) {
        const pages = Math.ceil(data.count / limit);
        const ids: number[] = data.rows.map((plan) => plan.id);
        return ok({ success: true, ids, data: data.rows, resultsNum: data.count, pages });
      } else {
        return ok({ success: false, message: 'No plans by this query', data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(plan: PlanCreationAttributes): Promise<Result<ItemApiResponse<Plan>, BaseResponse>> {
    try {
      const createdPlan = await Plan.create({
        title: plan.title,
        budget: plan.budget,
        deadline: plan.deadline,
        description: plan.description,
        progress: 0,
        OrganizationId: plan.OrganizationId,
        CreatorId: plan.CreatorId
      });

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
            await createdPlan.setActiveStage(stage);
          }
          await createdPlan.addStage(stage, {
            through: {
              order: i,
              completed: false
            }
          });
        });
      }

      if (plan.Participants) {
        const users = await User.findAll({
          where: {
            [Op.or]: plan.Participants as { id: number }[]
          }
        });
        createdPlan.setParticipants(users);
      }

      const data = await this.findByPk(createdPlan.id);

      if (data) {
        return ok({ success: true, message: 'Plan created successfully!', data });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async updateOne(plan: PlanAttributes): Promise<Result<ItemApiResponse<Plan>, BaseResponse>> {
    try {
      await Plan.update(
        {
          title: plan.title,
          description: plan.description,
          budget: plan.budget,
          deadline: plan.deadline
        },
        {
          where: { id: plan.id }
        }
      );

      if (plan.Participants) {
        const users = await User.findAll({
          where: {
            [Op.or]: plan.Participants as { id: number }[]
          }
        });
        await (
          await Plan.findByPk(plan.id, {
            attributes: ['id']
          })
        ).setParticipants(users);
      }

      const data = await this.findByPk(plan.id);

      if (data) {
        return ok({ success: true, message: 'Plan updated successfully!', data });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(id: string | number | string[] | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const deleted = await Plan.destroy({
        where: { id }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} plan` });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No plans by this query', data: null });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

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

  // Private functions
  private findByPk(id: number | string): Promise<Plan> {
    return Plan.findByPk(id, {
      include: [...this.includes]
    });
  }
}
