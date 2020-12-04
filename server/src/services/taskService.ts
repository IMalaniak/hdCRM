import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions } from 'sequelize';

import {
  BaseResponse,
  Task,
  ItemApiResponse,
  TaskAttributes,
  TaskCreationAttributes,
  TaskPriority,
  CollectionApiResponse,
  ErrorOrigin
} from '../models';
import { CONSTANTS } from '../constants';
import { Logger } from '../utils/Logger';

@Service()
export class TaskService {
  private includes: IncludeOptions[] = [
    {
      model: TaskPriority as any
    }
  ];

  constructor(private readonly logger: Logger) {}

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
        return ok({ success: false, message: 'No tasks by this query', data: [] });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getBy(id: number | string): Promise<Result<ItemApiResponse<Task>, BaseResponse>> {
    try {
      const task = await Task.findByPk(id);
      if (task) {
        return ok({ success: true, data: task });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No task with such key', data: null });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(task: TaskCreationAttributes): Promise<Result<ItemApiResponse<Task>, BaseResponse>> {
    try {
      const data = await Task.create(task);
      if (data) {
        return ok({ success: true, message: 'Task is created successfully!', data });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async updateOne(task: TaskAttributes): Promise<Result<ItemApiResponse<Task>, BaseResponse>> {
    try {
      await Task.update(
        {
          ...task
        },
        {
          where: { id: task.id }
        }
      );

      const data = await Task.findByPk(task.id);

      if (data) {
        return ok({ success: true, message: 'Task is updated successfully!', data });
      }
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(id: string | string[] | number | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    try {
      const deleted = await Task.destroy({
        where: { id }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} task(s)` });
      } else {
        return err({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'No tasks by this query', data: null });
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
