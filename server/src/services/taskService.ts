import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions } from 'sequelize';

import {
  BaseResponse,
  Task,
  TaskAttributes,
  TaskCreationAttributes,
  TaskPriority,
  CollectionApiResponse
} from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/baseService';

@Service()
export class TaskService extends BaseService<TaskCreationAttributes, TaskAttributes, Task> {
  public includes: IncludeOptions[] = [
    {
      model: TaskPriority as any
    }
  ];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Task);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_TASK);
  }

  public async getAll(CreatorId: number): Promise<Result<CollectionApiResponse<Task>, BaseResponse>> {
    try {
      const data = await Task.findAll({
        where: {
          CreatorId
        },
        include: this.includes
      });

      if (data.length) {
        return ok({ success: true, data });
      } else {
        return ok({ success: false, message: `No ${CONSTANTS.MODELS_NAME_TASK}s by this query`, data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getPriorities(): Promise<Result<CollectionApiResponse<TaskPriority>, BaseResponse>> {
    try {
      const data = await TaskPriority.findAll();

      if (data.length) {
        return ok({ success: true, data });
      } else {
        return ok({ success: false, message: 'No tasks priorities by this query', data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }
}
