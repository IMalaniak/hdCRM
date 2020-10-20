import { Service } from 'typedi';
import { Router } from 'express';
import { Passport } from '../config';
import { AuthRoutes } from './auth';
import { DepartmentRoutes } from './department';
import { FileRoutes } from './file';
import { FormRoutes } from './form';
import { PlanRoutes } from './plan';
import { PreferenceRoutes } from './preferences';
import { PrivilegeRoutes } from './privilege';
import { RoleRoutes } from './role';
import { StageRoutes } from './stage';
import { TaskRoutes } from './task';
import { TaskPriorityRoutes } from './taskPriority';
import { UserRoutes } from './user';

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

  public async register(expressRouter: Router) {
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
