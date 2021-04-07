import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions } from 'sequelize';

import { Task, TaskAttributes, TaskCreationAttributes, TaskPriority, CollectionApiResponse } from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';
import { CustomError, InternalServerError } from '../errors';

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

  public async getAll(CreatorId: number): Promise<Result<CollectionApiResponse<Task>, CustomError>> {
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
        return ok({ message: `No ${CONSTANTS.MODELS_NAME_TASK}s by this query`, data: [] });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async getPriorities(): Promise<Result<CollectionApiResponse<TaskPriority>, CustomError>> {
    try {
      const data = await TaskPriority.findAll();

      if (data.length) {
        return ok({ data });
      } else {
        return ok({ message: 'No tasks priorities by this query', data: [] });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
