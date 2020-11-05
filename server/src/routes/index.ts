import { Service } from 'typedi';
import { Router } from 'express';
import { Passport } from '../config';
import { AuthRoutes } from './authRoutes';
import { DepartmentRoutes } from './departmentRoutes';
import { FileRoutes } from './fileRoutes';
import { FormRoutes } from './formRoutes';
import { PlanRoutes } from './planRoutes';
import { PreferenceRoutes } from './preferenceRoutes';
import { PrivilegeRoutes } from './privilegeRoutes';
import { RoleRoutes } from './roleRoutes';
import { StageRoutes } from './stageRoutes';
import { TaskRoutes } from './taskRoutes';
import { TaskPriorityRoutes } from './taskPriorityRoutes';
import { UserRoutes } from './userRoutes';

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
