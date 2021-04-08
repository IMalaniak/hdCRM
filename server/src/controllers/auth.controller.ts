import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

import { CustomError } from '../errors/custom-error';
import { CryptoUtils, JwtUtils, parseCookies } from '../utils';
import { BaseResponse, PasswordReset, RequestWithBody } from '../models';
import { OrganizationCreationAttributes, UserCreationAttributes } from '../repositories';
import { AuthService, UserService } from '../services';
import { sendResponse } from './utils';

@Service()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly crypt: CryptoUtils,
    private readonly jwtHelper: JwtUtils
  ) {}

  public async register(req: Request, res: Response<BaseResponse | BaseResponse>): Promise<void> {
    req.log.info('Registering new user...');

    const password = req.body.password ? req.body.password : this.crypt.genRandomString(12);
    const passwordData = this.crypt.saltHashPassword(password);

    const OrgDefaults: any = {
      Roles: [
        {
          keyString: 'admin'
        }
      ]
    };

    const organization: OrganizationCreationAttributes = {
      ...OrgDefaults,
      ...req.body.Organization,
      ...(!req.body.Organization.title && { title: `PRIVATE_ORG_FOR_${req.body.name}_${req.body.surname}` })
    };

    const user: Partial<UserCreationAttributes> = {
      email: req.body.email,
      login: req.body.login,
      passwordHash: passwordData.passwordHash,
      salt: passwordData.salt,
      name: req.body.name,
      surname: req.body.surname,
      defaultLang: 'en',
      phone: req.body.phone
    };

    const result = await this.authService.register({ organization, user, password });

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async activateAccount(
    req: RequestWithBody<{ token: string }>,
    res: Response<BaseResponse | BaseResponse>
  ): Promise<void> {
    req.log.info(`Activating new user...`);

    const { token } = req.body;

    const result = await this.authService.activateAccount(token);

    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async authenticate(
    req: RequestWithBody<{ login: string; password: string }>,
    res: Response<string | BaseResponse>
  ): Promise<void> {
    req.log.info(`Authenticating web client...`);

    const loginOrEmail = req.body.login;
    const password = req.body.password;
    const result = await this.authService.authenticate({
      loginOrEmail,
      password,
      connection: {
        IP: req.ip,
        UA: req.headers['user-agent']
      }
    });

    return result.match<void>(
      (body) => {
        // set cookie for one year, it doest matter, because it has token that itself has an expiration date;
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        res.cookie('refresh_token', body.refreshToken, { httpOnly: true, expires });
        res.status(StatusCodes.OK);
        res.json(body.accessToken);
      },
      (error) => {
        res.status(StatusCodes.BAD_REQUEST);
        res.send(error.serializeErrors());
      }
    );
  }

  public async refreshSession(req: Request, res: Response<string | BaseResponse>): Promise<void> {
    req.log.info(`Refreshing session...`);

    const cookies = parseCookies(req) as any;

    const result = await this.authService.refreshSession(cookies.refresh_token);

    return result.match<void>(
      (body) => {
        res.status(StatusCodes.OK);
        res.json(body.accessToken);
      },
      (error) => {
        res.status(StatusCodes.BAD_REQUEST);
        res.send(error.serializeErrors());
      }
    );
  }

  public async logout(req: Request, res: Response<BaseResponse | BaseResponse>): Promise<void> {
    req.log.info(`Logging user out...`);

    const cookies = parseCookies(req) as any;
    const decodedResult = this.jwtHelper.getDecoded(cookies.refresh_token);
    if (decodedResult.isOk()) {
      await this.userService.removeSession(decodedResult.value.sessionId);
    }
    // force cookie expiration
    const expires = new Date(1970);
    res.cookie('refresh_token', null, { httpOnly: true, expires });
    req.logout();
    res.status(StatusCodes.OK).json({ message: 'logged out' });
  }

  public async forgotPassword(req: Request, res: Response<BaseResponse>): Promise<void> {
    req.log.info(`Forget password requesting...`);

    const loginOrEmail = req.body.login;

    const result = await this.authService.forgotPassword(loginOrEmail);
    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async resetPassword(req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>): Promise<void> {
    req.log.info(`Reseting new password...`);

    const result = await this.authService.resetPassword(req.body);
    return sendResponse<BaseResponse, CustomError>(result, res);
  }
}
