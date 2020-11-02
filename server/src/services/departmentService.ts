import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  User,
  Asset,
  ItemApiResponse,
  PageQueryWithOrganization,
  DepartmentCreationAttributes,
  DepartmentAttributes
} from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class DepartmentService {
  private includes: IncludeOptions[] = [
    {
      model: Department as any,
      as: 'ParentDepartment',
      required: false
    },
    {
      model: Department as any,
      as: 'SubDepartments',
      required: false
    },
    {
      model: User as any,
      as: 'Workers',
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          model: Asset as any,
          as: 'avatar'
        }
      ],
      required: false
    },
    {
      model: User as any,
      as: 'Manager',
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          model: Asset as any,
          as: 'avatar'
        }
      ],
      required: false
    }
  ];

  public async getDashboardData(orgId: number): Promise<Result<CollectionApiResponse<Department>, BaseResponse>> {
    try {
      const data = await Department.findAndCountAll({
        attributes: ['title', 'id'],
        where: {
          OrganizationId: orgId
        },
        include: [
          {
            model: User as any,
            as: 'Workers',
            attributes: ['id'],
            required: false
          }
        ],
        order: [['id', 'ASC']]
      });
      return ok({ success: true, data: data.rows, resultsNum: data.count });
    } catch (error) {
      // Logger.Err(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getDataById(id: number | string): Promise<Result<ItemApiResponse<Department>, BaseResponse>> {
    // Logger.Info(`Selecting department by key: ${key}...`);
    try {
      const department = await this.findByPk(id);
      if (department) {
        return ok({ success: true, data: department });
      } else {
        return ok({ success: false, message: 'No department with such id', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getPage(
    pageQuery: PageQueryWithOrganization
  ): Promise<Result<CollectionApiResponse<Department>, BaseResponse>> {
    // Logger.Info(`Getting departments by page query...`);
    try {
      const { limit, offset, sortDirection, sortIndex, OrganizationId } = pageQuery;

      const data = await Department.findAndCountAll({
        where: {
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
        const ids: number[] = data.rows.map((dep) => dep.id);
        return ok({ success: true, ids, data: data.rows, resultsNum: data.count, pages });
      } else {
        return ok({ success: false, message: 'No departments by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(
    department: DepartmentCreationAttributes
  ): Promise<Result<ItemApiResponse<Department>, BaseResponse>> {
    // Logger.Info(`Creating new department...`);

    try {
      const createdDep = await Department.create({
        title: department.title,
        description: department.description,
        OrganizationId: department.OrganizationId,
        ...(department.Manager && { managerId: department.Manager.id })
      });

      if (department.ParentDepartment) {
        await this.addParentDepartment(createdDep, department.ParentDepartment);
      }

      if (department.SubDepartments?.length) {
        await this.addSubDepartments(createdDep, department.SubDepartments);
      }

      if (department.Workers?.length) {
        await this.addWorkers(createdDep, department.Workers);
      }

      const data = await this.findByPk(createdDep.id);

      if (data) {
        return ok({ success: true, message: 'Department created successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async updateOne(department: DepartmentAttributes): Promise<Result<ItemApiResponse<Department>, BaseResponse>> {
    // Logger.Info(`Updating department by id: ${department.id}...`);
    try {
      await Department.update(
        {
          title: department.title,
          description: department.description,
          ...(department.Manager && { managerId: department.Manager.id })
        },
        {
          where: { id: department.id }
        }
      );

      if (department.ParentDepartment || department.SubDepartments?.length || department.Workers?.length) {
        const updated = await Department.findByPk(department.id, { attributes: ['id'] });

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

      const data = await this.findByPk(department.id);

      if (data) {
        return ok({ success: true, message: 'Department updated successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(id: string | number | string[] | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Deleting department(s) by id: ${id}...`);
    try {
      const deleted = await Department.destroy({
        where: { id }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} department` });
      } else {
        return ok({ success: false, message: 'No departments by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  // Private functions
  private findByPk(id: number | string): Promise<Department> {
    return Department.findByPk(id, {
      include: [...this.includes]
    });
  }

  private async addParentDepartment(department: Department, parentDepartment: Department): Promise<void> {
    return await department.setParentDepartment(parentDepartment.id);
  }

  private async addSubDepartments(department: Department, subDepartmentIds: { id: number }[]): Promise<void> {
    const subDepartments = await Department.findAll({ where: { [Op.or]: subDepartmentIds }, attributes: ['id'] });
    return await department.setSubDepartments(subDepartments);
  }

  private async addWorkers(department: Department, workerIds: { id: number }[]): Promise<void> {
    const workers = await User.findAll({ where: { [Op.or]: workerIds }, attributes: ['id'] });
    return await department.setWorkers(workers);
  }
}
