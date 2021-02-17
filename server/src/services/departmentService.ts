import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  User,
  DepartmentCreationAttributes,
  DepartmentAttributes
} from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';

@Service()
export class DepartmentService extends BaseService<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  public excludes: string[] = [];
  public readonly includes: IncludeOptions[] = [
    {
      association: Department.associations.ParentDepartment,
      required: false
    },
    {
      association: Department.associations.SubDepartments,
      required: false
    },
    {
      association: Department.associations.Workers,
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          association: User.associations.avatar
        }
      ],
      required: false
    },
    {
      association: Department.associations.Manager,
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          association: User.associations.avatar
        }
      ],
      required: false
    }
  ];

  public async getDashboardData(orgId: number): Promise<Result<CollectionApiResponse<Department>, BaseResponse>> {
    try {
      const data = await this.MODEL.findAndCountAll({
        attributes: ['title', 'id'],
        where: {
          OrganizationId: orgId
        },
        include: [
          {
            association: Department.associations.Workers,
            attributes: ['id'],
            required: false
          }
        ],
        order: [['id', 'ASC']]
      });
      return ok({ success: true, data: data.rows, resultsNum: data.count });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async sideEffect(department: Department, id: number): Promise<Department> {
    if (department.ParentDepartment || department.SubDepartments?.length || department.Workers?.length) {
      const updated = await this.MODEL.findByPk(id, { attributes: ['id'] });

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
    return this.findByPk(id);
  }

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Department);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_DEPARTMENT);
  }

  private async addParentDepartment(department: Department, parentDepartment: Department): Promise<void> {
    return await department.setParentDepartment(parentDepartment.id);
  }

  private async addSubDepartments(department: Department, subDepartmentIds: { id: number }[]): Promise<void> {
    const subDepartments = await this.MODEL.findAll({ where: { [Op.or]: subDepartmentIds }, attributes: ['id'] });
    return await department.setSubDepartments(subDepartments);
  }

  private async addWorkers(department: Department, workerIds: { id: number }[]): Promise<void> {
    const workers = await User.findAll({ where: { [Op.or]: workerIds }, attributes: ['id'] });
    return await department.setWorkers(workers);
  }
}
