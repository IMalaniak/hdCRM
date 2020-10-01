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
  TaskController,
  PreferenceController,
  FormController
} from './controllers';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { TaskPriorityController } from './controllers/taskPriority';

@Controller('api/')
@ClassOptions({ mergeParams: true })
@Children([
  new AuthController(),
  new DepartmentController(),
  new FileController(),
  new PlanController(),
  new PrivilegeController(),
  new RoleController(),
  new StageController(),
  new UserController(),
  new TaskController(),
  new TaskPriorityController(),
  new PreferenceController(),
  new FormController()
])
export class ApiController {
  @Get('')
  connectionCheck(_: Request, res: Response) {
    res.status(OK).json({ success: true, message: 'Connected!' });
  }
}
