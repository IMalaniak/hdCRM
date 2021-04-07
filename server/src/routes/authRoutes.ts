import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseResponse, PasswordReset, RequestWithBody } from '../models';
import { AuthController } from '../controllers';
import { CustomError } from '../errors';

@Service()
export class AuthRoutes {
  private router: Router = Router();

  constructor(private readonly authController: AuthController) {}

  public register(): Router {
    this.router.post('/register', async (req: Request, res: Response<BaseResponse | CustomError>) =>
      this.authController.register(req, res)
    );

    this.router.post(
      '/activate_account',
      async (req: RequestWithBody<{ token: string }>, res: Response<BaseResponse | CustomError>) =>
        this.authController.activateAccount(req, res)
    );

    this.router.post(
      '/authenticate',
      async (req: RequestWithBody<{ login: string; password: string }>, res: Response<string | CustomError>) =>
        this.authController.authenticate(req, res)
    );

    this.router.get('/refresh-session', async (req: Request, res: Response<string | CustomError>) =>
      this.authController.refreshSession(req, res)
    );

    this.router.post('/forgot_password', async (req: Request, res: Response<BaseResponse | CustomError>) =>
      this.authController.forgotPassword(req, res)
    );

    this.router.post(
      '/reset_password',
      async (req: RequestWithBody<PasswordReset>, res: Response<BaseResponse | CustomError>) =>
        this.authController.resetPassword(req, res)
    );

    this.router.get('/logout', async (req: Request, res: Response<BaseResponse | CustomError>) =>
      this.authController.logout(req, res)
    );

    return this.router;
  }
}
