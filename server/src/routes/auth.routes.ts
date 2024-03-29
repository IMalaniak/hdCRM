/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

import { BaseResponse, PasswordReset, RequestWithBody } from '../models';
import { AuthController } from '../controllers';
import { AuthResponse } from '../models/authResponse';
import { Passport } from '../config';

@Service()
export class AuthRoutes {
  private readonly router: Router = Router();

  constructor(private readonly authController: AuthController, private readonly passport: Passport) {}

  public register(): Router {
    this.router.post(
      '/google',
      this.passport.authenticate('google', { scope: ['profile'] }),
      async (req: Request, res: Response<AuthResponse | BaseResponse>) => this.authController.oauth(req, res)
    );

    this.router.post('/register', async (req: Request, res: Response<BaseResponse>) =>
      this.authController.register(req, res)
    );

    this.router.post(
      '/activate_account',
      async (req: RequestWithBody<{ token: string }>, res: Response<BaseResponse>) =>
        this.authController.activateAccount(req, res)
    );

    this.router.post(
      '/authenticate',
      async (req: RequestWithBody<{ email: string; password: string }>, res: Response<AuthResponse | BaseResponse>) =>
        this.authController.authenticate(req, res)
    );

    this.router.get('/refresh-session', async (req: Request, res: Response<AuthResponse | BaseResponse>) =>
      this.authController.refreshSession(req, res)
    );

    this.router.post('/forgot_password', async (req: Request, res: Response<BaseResponse>) =>
      this.authController.forgotPassword(req, res)
    );

    this.router.post('/reset_password', async (req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>) =>
      this.authController.resetPassword(req, res)
    );

    this.router.get('/logout', async (req: Request, res: Response<BaseResponse>) =>
      this.authController.logout(req, res)
    );

    return this.router;
  }
}
