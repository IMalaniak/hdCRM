import { Service } from 'typedi';
import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';

import { apiDocs } from '../apiDocs';
import { Passport } from '../config';
import { AuthRoutes } from './auth.routes';
import { DepartmentRoutes } from './department.routes';
import { FileRoutes } from './file.routes';
import { FormRoutes } from './form.routes';
import { PlanRoutes } from './plan.routes';
import { PreferenceRoutes } from './preference.routes';
import { PrivilegeRoutes } from './privilege.routes';
import { RoleRoutes } from './role.routes';
import { StageRoutes } from './stage.routes';
import { TaskRoutes } from './task.routes';
import { TaskPriorityRoutes } from './task-priority.routes';
import { UserRoutes } from './user.routes';

@Service()
export class Routes {
  constructor(
    private readonly passport: Passport,
    private readonly authRoutes: AuthRoutes,
    private readonly departmentRoutes: DepartmentRoutes,
    private readonly fileRoutes: FileRoutes,
    private readonly formRoutes: FormRoutes,
    private readonly planRoutes: PlanRoutes,
    private readonly preferenceRoutes: PreferenceRoutes,
    private readonly privilegeRoutes: PrivilegeRoutes,
    private readonly roleRoutes: RoleRoutes,
    private readonly stageRoutes: StageRoutes,
    private readonly taskRoutes: TaskRoutes,
    private readonly taskPriorityRoutes: TaskPriorityRoutes,
    private readonly userRoutes: UserRoutes
  ) {}

  public register(expressRouter: Router): void {
    expressRouter.use('/api-docs', this.passport.authenticate('basic'), swaggerUi.serve, swaggerUi.setup(apiDocs));
    expressRouter.use('/api/auth', this.authRoutes.register());
    expressRouter.use('/api', this.passport.authenticate(), this.registerApiRoutes());
  }

  private registerApiRoutes(): Router {
    const apiRouter = Router();

    apiRouter.use('/departments', this.departmentRoutes.register());
    apiRouter.use('/files', this.fileRoutes.register());
    apiRouter.use('/forms', this.formRoutes.register());
    apiRouter.use('/plans', this.planRoutes.register());
    apiRouter.use('/preferences', this.preferenceRoutes.register());
    apiRouter.use('/privileges', this.privilegeRoutes.register());
    apiRouter.use('/roles', this.roleRoutes.register());
    apiRouter.use('/stages', this.stageRoutes.register());
    apiRouter.use('/tasks', this.taskRoutes.register());
    apiRouter.use('/task-priorities', this.taskPriorityRoutes.register());
    apiRouter.use('/users', this.userRoutes.register());

    return apiRouter;
  }
}
