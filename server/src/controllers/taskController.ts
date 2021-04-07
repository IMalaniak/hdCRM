import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import {
  BaseResponse,
  CollectionApiResponse,
  RequestWithBody,
  Task,
  TaskAttributes,
  TaskCreationAttributes,
  TaskPriority
} from '../models';
import { TaskService } from '../services';
import { BaseController } from './base/baseController';
import { sendResponse } from './utils';

@Service()
export class TaskController extends BaseController<TaskCreationAttributes, TaskAttributes, Task> {
  constructor(protected readonly dataBaseService: TaskService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_TASK);
  }

  public async getAll(req: Request, res: Response<CollectionApiResponse<Task> | CustomError>): Promise<void> {
    const creatorId = req.user.id;
    req.log.info(`Selecting all tasks...`);

    const result = await this.dataBaseService.getAll(creatorId);

    return sendResponse<CollectionApiResponse<Task>, CustomError>(result, res);
  }

  public async deleteMultiple(
    req: RequestWithBody<{ taskIds: number[] }>,
    res: Response<BaseResponse | CustomError>
  ): Promise<void> {
    const {
      body: { taskIds }
    } = req;
    req.log.info(`Deleting multiple tasks...`);
    const result = await this.dataBaseService.delete(taskIds);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async getPriorities(
    req: Request,
    res: Response<CollectionApiResponse<TaskPriority> | CustomError>
  ): Promise<void> {
    req.log.info(`Selecting all task priorities...`);

    const result = await this.dataBaseService.getPriorities();

    return sendResponse<CollectionApiResponse<TaskPriority>, CustomError>(result, res);
  }

  protected generateCreationAttributes(req: RequestWithBody<TaskCreationAttributes>): TaskCreationAttributes {
    return {
      ...req.body,
      CreatorId: req.user.id
    };
  }
}
