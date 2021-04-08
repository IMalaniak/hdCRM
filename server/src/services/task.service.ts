import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions } from 'sequelize';

import { CollectionApiResponse, BaseResponse } from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/base.service';
import { CustomError, InternalServerError } from '../errors';
import { TaskCreationAttributes, TaskAttributes, Task, TaskPriority } from '../repositories';

@Service()
export class TaskService extends BaseService<TaskCreationAttributes, TaskAttributes, Task> {
  protected includes: IncludeOptions[] = [
    {
      model: TaskPriority as any
    }
  ];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Task);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_TASK);
  }

  public async getAll(CreatorId: number): Promise<Result<CollectionApiResponse<Task> | BaseResponse, CustomError>> {
    try {
      const data = await Task.findAll({
        where: {
          CreatorId
        },
        include: this.includes
      });

      if (data.length) {
        return ok({ data });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async getPriorities(): Promise<Result<CollectionApiResponse<TaskPriority> | BaseResponse, CustomError>> {
    try {
      const data = await TaskPriority.findAll();

      if (data.length) {
        return ok({ data });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
