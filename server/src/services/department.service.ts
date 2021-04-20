import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import { CollectionApiResponse } from '../models';
import { CONSTANTS } from '../constants';
import { CustomError, InternalServerError } from '../errors';
import { DepartmentCreationAttributes, DepartmentAttributes, Department, User, Asset } from '../repositories';

import { BaseService } from './base/base.service';

@Service()
export class DepartmentService extends BaseService<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  protected readonly includes: IncludeOptions[] = [
    {
      model: Department,
      as: 'ParentDepartment',
      required: false
    },
    {
      model: Department,
      as: 'SubDepartments',
      required: false
    },
    {
      model: User,
      as: 'Workers',
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Asset,
          as: 'avatar'
        }
      ],
      required: false
    },
    {
      model: User,
      as: 'Manager',
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Asset,
          as: 'avatar'
        }
      ],
      required: false
    }
  ];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Department);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_DEPARTMENT);
  }

  public async getDashboardData(orgId: number): Promise<Result<CollectionApiResponse<Department>, CustomError>> {
    try {
      const data = await this.MODEL.findAndCountAll({
        attributes: ['title', 'id'],
        where: {
          OrganizationId: orgId
        },
        include: [
          {
            model: User,
            as: 'Workers',
            attributes: ['id'],
            required: false
          }
        ],
        order: [['id', 'ASC']]
      });
      return ok({ data: data.rows, resultsNum: data.count });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  protected async postAction(department: Department, id: number): Promise<Department> {
    if (department.ParentDepartment || department.SubDepartments?.length || department.Workers?.length) {
      const updated = (await this.MODEL.findByPk(id, { attributes: ['id'] })) as Department;

      if (department.ParentDepartment) {
        await this.addParentDepartment(updated, department.ParentDepartment);
      }

      if (department.SubDepartments?.length) {
        await this.addSubDepartments(updated, department.SubDepartments);
      }

      if (department.Workers?.length) {
        await this.addWorkers(updated, department.Workers);
      }
    }
    return this.findByPk(id) as Promise<Department>;
  }

  private async addParentDepartment(department: Department, parentDepartment: Department): Promise<void> {
    return department.setParentDepartment(parentDepartment.id);
  }

  private async addSubDepartments(department: Department, subDepartmentIds: { id: number }[]): Promise<void> {
    const subDepartments = await this.MODEL.findAll({ where: { [Op.or]: subDepartmentIds }, attributes: ['id'] });
    return department.setSubDepartments(subDepartments);
  }

  private async addWorkers(department: Department, workerIds: { id: number }[]): Promise<void> {
    const workers = await User.findAll({ where: { [Op.or]: workerIds }, attributes: ['id'] });
    return department.setWorkers(workers);
  }
}
