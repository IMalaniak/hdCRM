import { Request } from 'express';
import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { StatusCodes } from 'http-status-codes';
import { IncludeOptions, Op } from 'sequelize';

import {
  BaseResponse,
  CollectionApiResponse,
  Department,
  User,
  ApiResponse,
  Asset,
  ItemApiResponse,
  RequestWithBody,
  RequestWithQuery,
  CollectionQuery
} from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class DepartmentController {
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

  public async getDashboardData(req: Request): Promise<ApiResponse<CollectionApiResponse<Department> | BaseResponse>> {
    let result: Result<CollectionApiResponse<Department>, BaseResponse>;
    try {
      const data = await Department.findAndCountAll({
        attributes: ['title', 'id'],
        where: {
          OrganizationId: req.user.OrganizationId
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
      result = ok({ success: true, data: data.rows, resultsNum: data.count });
    } catch (error) {
      // Logger.Err(error);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<CollectionApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async getDataById(id: number | string): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    // Logger.Info(`Selecting department by key: ${key}...`);
    let result: Result<ItemApiResponse<Department>, BaseResponse>;
    try {
      const department = await this.findByPk(id);
      if (department) {
        result = ok({ success: true, data: department });
      } else {
        result = ok({ success: false, message: 'No department with such id', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async getPage(
    req: RequestWithQuery<CollectionQuery>
  ): Promise<ApiResponse<CollectionApiResponse<Department> | BaseResponse>> {
    let result: Result<CollectionApiResponse<Department>, BaseResponse>;

    try {
      const { pageSize, pageIndex, sortDirection, sortIndex } = req.query;
      const limit = parseInt(pageSize);
      const offset = parseInt(pageIndex) * limit;
      const OrganizationId = req.user.OrganizationId;

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
        result = ok({ success: true, data: data.rows, resultsNum: data.count, pages });
      } else {
        result = ok({ success: false, message: 'No departments by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<CollectionApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async create(
    req: RequestWithBody<Partial<Department>>
  ): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    // Logger.Info(`Creating new department...`);
    let result: Result<ItemApiResponse<Department>, BaseResponse>;

    try {
      const createdDep = await Department.create({
        title: req.body.title,
        description: req.body.description,
        managerId: req.body.Manager.id,
        OrganizationId: req.user.OrganizationId
      });

      if (req.body.ParentDepartment) {
        await this.addParentDepartment(createdDep, req.body.ParentDepartment);
      }

      if (req.body.SubDepartments?.length) {
        await this.addSubDepartments(createdDep, req.body.SubDepartments);
      }

      if (req.body.Workers?.length) {
        await this.addWorkers(createdDep, req.body.Workers);
      }

      const data = await this.findByPk(createdDep.id);

      if (data) {
        result = ok({ success: true, message: 'Department created successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async updateOne(
    req: RequestWithBody<Department>
  ): Promise<ApiResponse<ItemApiResponse<Department> | BaseResponse>> {
    // Logger.Info(`Updating department by id: ${department.id}...`);
    let result: Result<ItemApiResponse<Department>, BaseResponse>;

    try {
      await Department.update(
        {
          title: req.body.title,
          description: req.body.description,
          managerId: req.body.Manager.id
        },
        {
          where: { id: req.body.id }
        }
      );

      if (req.body.ParentDepartment || req.body.SubDepartments?.length || req.body.Workers?.length) {
        const updated = await Department.findByPk(req.body.id, { attributes: ['id'] });

        if (req.body.ParentDepartment) {
          await this.addParentDepartment(updated, req.body.ParentDepartment);
        }

        if (req.body.SubDepartments?.length) {
          await this.addSubDepartments(updated, req.body.SubDepartments);
        }

        if (req.body.Workers?.length) {
          await this.addWorkers(updated, req.body.Workers);
        }
      }

      const data = await this.findByPk(req.body.id);

      if (data) {
        result = ok({ success: true, message: 'Department updated successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<ItemApiResponse<Department> | BaseResponse>>(
      (body) => ({ statusCode: StatusCodes.OK, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
  }

  public async delete(id: string | number | string[] | number[]): Promise<ApiResponse<BaseResponse>> {
    // Logger.Info(`Deleting department(s) by id: ${id}...`);
    let result: Result<BaseResponse, BaseResponse>;
    try {
      const deleted = await Department.destroy({
        where: { id }
      });

      if (deleted > 0) {
        result = ok({ success: true, message: `Deleted ${result} department` });
      } else {
        result = ok({ success: false, message: 'No departments by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      result = err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }

    return result.match<ApiResponse<BaseResponse>>(
      (body) => ({ statusCode: body.success ? StatusCodes.OK : StatusCodes.NOT_FOUND, body }),
      (_error) => ({ statusCode: StatusCodes.BAD_REQUEST, body: _error })
    );
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
