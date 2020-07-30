import { Controller, ClassOptions, Children, Get } from '@overnightjs/core';
import {
  UserController,
  AuthController,
  DepartmentController,
  FileController,
  PlanController,
  PrivilegeController,
  RoleController,
  StageController,
  StateController,
  ChatController,
  TaskController,
  PreferenceController
} from './controllers';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { TaskPriorityController } from './controllers/taskPriority';

@Controller('api/')
@ClassOptions({ mergeParams: true })
@Children([
  new AuthController(),
  new ChatController(),
  new DepartmentController(),
  new FileController(),
  new PlanController(),
  new PrivilegeController(),
  new RoleController(),
  new StageController(),
  new StateController(),
  new UserController(),
  new TaskController(),
  new TaskPriorityController(),
  new PreferenceController()
])
export class ApiController {
  @Get('')
  private connectionCheck(req: Request, res: Response) {
    res.status(OK).json({ success: true, message: 'Connected!' });
  }
}
