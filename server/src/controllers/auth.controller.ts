import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

import { CustomError } from '../errors/custom-error';
import { BaseResponse, PasswordReset, RequestWithBody } from '../models';
import { AuthResponse } from '../models/authResponse';
import { Organization, OrganizationCreationAttributes, UserCreationAttributes } from '../repositories';
import { AuthService, UserService } from '../services';
import { CryptoUtils } from '../utils/crypto.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { parseCookies } from '../utils/parseCookies';

import { sendResponse } from './utils';

type RegisterBody = UserCreationAttributes & { Organization: OrganizationCreationAttributes; password: string };
@Service()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly crypt: CryptoUtils,
    private readonly jwtHelper: JwtUtils
  ) {}

  public async register(req: RequestWithBody<RegisterBody>, res: Response<BaseResponse | BaseResponse>): Promise<void> {
    req.log.info('Registering new user...');

    const password = req.body.password ? req.body.password : this.crypt.genRandomString(12);

    const orgDefaults = {
      Roles: [
        {
          keyString: 'admin'
        }
      ]
    } as Organization;

    const organization: OrganizationCreationAttributes = {
      ...orgDefaults,
      ...req.body.Organization
    };

    const user: Partial<UserCreationAttributes> = {
      email: req.body.email,
      password,
      name: req.body.name,
      surname: req.body.surname,
      locale: 'en',
      phone: req.body.phone
    };

    const result = await this.authService.register({ organization, user });

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
    req: RequestWithBody<{ email: string; password: string }>,
    res: Response<AuthResponse | BaseResponse>
  ): Promise<void> {
    req.log.info(`Authenticating web client...`);

    const email = req.body.email;
    const password = req.body.password;
    const result = await this.authService.authenticate({
      email,
      password,
      connection: {
        IP: req.ip,
        UA: req.headers['user-agent']
      }
    });

    return result.match<void>(
      ({ refreshToken, accessToken, expiresIn, sessionId, tokenType }) => {
        // set cookie for one year, it doest matter, because it has token that itself has an expiration date;
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        res.cookie('refresh_token', refreshToken, { httpOnly: true, expires });
        res.status(StatusCodes.OK);
        res.send({ accessToken, expiresIn, sessionId, tokenType });
      },
      (error) => {
        res.status(error.statusCode);
        res.send(error.serializeErrors());
      }
    );
  }

  public async refreshSession(req: Request, res: Response<AuthResponse | BaseResponse>): Promise<void> {
    req.log.info(`Refreshing session...`);

    const cookies = parseCookies(req);

    const result = await this.authService.refreshSession(cookies.refresh_token);

    return result.match<void>(
      (body) => {
        res.status(StatusCodes.OK);
        res.send(body);
      },
      (error) => {
        res.status(error.statusCode);
        res.send(error.serializeErrors());
      }
    );
  }

  public async logout(req: Request, res: Response<BaseResponse | BaseResponse>): Promise<void> {
    req.log.info(`Logging user out...`);

    const cookies = parseCookies(req);
    if (cookies.refresh_token) {
      const decodedResult = this.jwtHelper.decode(cookies.refresh_token);
      if (decodedResult.isOk()) {
        await this.userService.removeSession(decodedResult.value.sub);
      }
    }
    // force cookie expiration
    const expires = new Date(1970);
    res.cookie('refresh_token', null, { httpOnly: true, expires });
    req.logout();
    res.status(StatusCodes.OK).json({ message: 'logged out' });
  }

  public async forgotPassword(req: RequestWithBody<{ email: string }>, res: Response<BaseResponse>): Promise<void> {
    req.log.info(`Forget password requesting...`);

    const result = await this.authService.forgotPassword(req.body.email);
    return sendResponse<BaseResponse, CustomError>(result, res);
  }

  public async resetPassword(req: RequestWithBody<PasswordReset>, res: Response<BaseResponse>): Promise<void> {
    req.log.info(`Reseting new password...`);

    const result = await this.authService.resetPassword(req.body);
    return sendResponse<BaseResponse, CustomError>(result, res);
  }
}
