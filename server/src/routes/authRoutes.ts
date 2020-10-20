import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { Op, ValidationError, UniqueConstraintError } from 'sequelize';
import { TokenExpiredError } from 'jsonwebtoken';

import { UserState } from '../constants';
import { User, UserSession, PasswordAttribute, Organization, Privilege, JwtDecoded, ApiResponse } from '../models';
import { UserController } from '../controllers';
import { Crypt } from '../utils/crypt';
import { Mailer } from '../mailer/nodeMailerTemplates';
import { JwtHelper } from '../helpers/jwtHelper';
import { parseCookies } from '../utils/parseCookies';
import { Config } from '../config';

@Service()
export class AuthRoutes {
  private router: Router = Router();

  constructor(
    private readonly userController: UserController,
    private readonly jwtHelper: JwtHelper,
    private readonly mailer: Mailer,
    private readonly crypt: Crypt
  ) {}

  public register(): Router {
    this.router.post(
      '/register',
      async (req: Request, res: Response<ApiResponse | ValidationError | UniqueConstraintError>) => {
        // Logger.Info(`Registering new user...`);
        const password = req.body.password ? req.body.password : this.crypt.genRandomString(12);
        const passwordData = this.crypt.saltHashPassword(password);

        const OrgDefaults: any = {
          Roles: [
            {
              keyString: 'admin'
            }
          ]
        };

        const Org = {
          ...OrgDefaults,
          ...req.body.Organization,
          ...(!req.body.Organization.title && { title: `PRIVATE_ORG_FOR_${req.body.name}_${req.body.surname}` })
        };

        // let transaction;
        try {
          // transaction = await sequelize.transaction();

          const organization = await Organization.create(Org, {
            include: [{ association: Organization.associations.Roles }]
          });
          if (organization) {
            const user = await organization.createUser({
              email: req.body.email,
              login: req.body.login,
              passwordHash: passwordData.passwordHash,
              salt: passwordData.salt,
              name: req.body.name,
              surname: req.body.surname,
              defaultLang: 'en',
              phone: req.body.phone
            });

            const privileges = await Privilege.findAll();
            const adminRole = organization.Roles[0];
            await adminRole.setPrivileges(privileges);
            await adminRole.getPrivileges().then((rPrivileges) => {
              rPrivileges.forEach((privilege) => {
                privilege.RolePrivilege.add = true;
                privilege.RolePrivilege.delete = true;
                privilege.RolePrivilege.edit = true;
                privilege.RolePrivilege.view = true;
                privilege.RolePrivilege.save();
              });
            });
            await adminRole.addUser(user);

            const token = this.crypt.genTimeLimitedToken(24 * 60);
            await user.createPasswordAttributes({
              token: token.value,
              tokenExpire: token.expireDate,
              passwordExpire: token.expireDate
            });

            const activationSent = await this.mailer.sendActivation(
              user,
              password,
              `${Config.WEB_URL}/auth/activate-account/${token.value}`
            );

            if (activationSent) {
              return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Activation link has been sent'
              });
            }
          }
        } catch (error) {
          // Logger.Err(error);
          return res.status(StatusCodes.BAD_REQUEST).json(error);
        }
      }
    );

    this.router.post('/activate_account', (req: Request, res: Response<ApiResponse>) => {
      // Logger.Info(`Creating new user...`);
      PasswordAttribute.findOne({
        where: {
          token: req.body.token,
          tokenExpire: {
            [Op.gt]: Date.now()
          }
        }
      })
        .then((pa) => {
          if (pa) {
            pa.getUser()
              .then((user) => {
                user.state = UserState.ACTIVE;
                user
                  .save()
                  .then((updatedUser) => {
                    updatedUser
                      .getPasswordAttributes()
                      .then((updatedPa) => {
                        if (updatedPa) {
                          updatedPa.token = null;
                          updatedPa.tokenExpire = null;
                          updatedPa
                            .save()
                            .then(() => {
                              this.mailer
                                .sendActivationConfirmation(updatedUser)
                                .then(() => {
                                  return res.status(StatusCodes.OK).json({
                                    success: true,
                                    message: 'You account has been activated successfully!'
                                  });
                                })
                                .catch((err: any) => {
                                  // Logger.Err(err);
                                  return res.status(StatusCodes.BAD_REQUEST).json(err);
                                });
                            })
                            .catch((err: any) => {
                              // Logger.Err(err);
                              return res.status(StatusCodes.BAD_REQUEST).json(err);
                            });
                        }
                      })
                      .catch((err: any) => {
                        // Logger.Err(err);
                        return res.status(StatusCodes.BAD_REQUEST).json(err);
                      });
                  })
                  .catch((err: any) => {
                    // Logger.Err(err);
                    return res.status(StatusCodes.BAD_REQUEST).json(err);
                  });
              })
              .catch((err: any) => {
                // Logger.Err(err);
                return res.status(StatusCodes.BAD_REQUEST).json(err);
              });
          } else {
            return res.status(StatusCodes.BAD_REQUEST).send({
              success: false,
              message: 'Your activation token is invalid or has expired!'
            });
          }
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.BAD_REQUEST).json(err);
        });
    });

    this.router.post('/authenticate', (req: Request, res: Response<ApiResponse | string>) => {
      // Logger.Info(`Authenticating web client...`);
      const loginOrEmail = req.body.login;
      const password = req.body.password;
      User.findOne({
        where: {
          [Op.or]: [
            {
              login: loginOrEmail
            },
            {
              email: loginOrEmail
            }
          ]
        },
        attributes: ['id', 'passwordHash', 'salt', 'state']
      })
        .then((user) => {
          if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: 'Sorry, there are no user with this email or login!'
            });
          }

          if (user.state === UserState.INITIALIZED) {
            this.saveLogInAttempt(req, user, false).then(() => {
              return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message:
                  'Sorry, Your account is not activated, please use activation link we sent You or contact administrator!'
              });
            });
          } else if (user.state === UserState.DISABLED || user.state === UserState.ARCHIVE) {
            this.saveLogInAttempt(req, user, false).then(() => {
              return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Sorry, Your account have been disabled, please contact administrator!'
              });
            });
          }

          const isMatch = this.crypt.validatePassword(password, user.passwordHash, user.salt);
          if (isMatch) {
            this.saveLogInAttempt(req, user, true).then((userSession) => {
              const accessToken = this.jwtHelper.generateToken({
                type: 'access',
                payload: { userId: user.id, sessionId: userSession.id }
              });
              const refreshToken = this.jwtHelper.generateToken({
                type: 'refresh',
                payload: { userId: userSession.UserId, sessionId: userSession.id }
              });
              // set cookie for one year, it doest matter, because it has token that itself has an expiration date;
              const expires = new Date();
              expires.setFullYear(expires.getFullYear() + 1);
              res.cookie('refresh_token', refreshToken, { httpOnly: true, expires });
              return res.status(StatusCodes.OK).json(`JWT ${accessToken}`);
            });
          } else {
            this.saveLogInAttempt(req, user, false).then(() => {
              return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message:
                  'Password that You provided is not correct, please make sure you have the right password or contact administrator!'
              });
            });
          }
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.BAD_REQUEST).json(err);
        });
    });

    this.router.get('/refresh-session', (req: Request, res: Response<ApiResponse | TokenExpiredError | string>) => {
      const cookies = parseCookies(req) as any;
      if (cookies.refresh_token) {
        this.jwtHelper
          .getVerified({ type: 'refresh', token: cookies.refresh_token })
          .then(({ userId, sessionId }: JwtDecoded) => {
            const newToken = this.jwtHelper.generateToken({ type: 'access', payload: { userId, sessionId } });
            return res.status(StatusCodes.OK).json(`JWT ${newToken}`);
          })
          .catch((err: TokenExpiredError) => {
            return res.status(StatusCodes.FORBIDDEN).send(err);
          });
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          success: false,
          message: 'No refresh token!'
        });
      }
    });

    this.router.post('/forgot_password', (req: Request, res: Response<ApiResponse>) => {
      // Logger.Info(`Forget password requesting...`);
      const loginOrEmail = req.body.login;

      User.findOne({
        where: {
          [Op.or]: [
            {
              login: loginOrEmail
            },
            {
              email: loginOrEmail
            }
          ]
        }
      })
        .then((user) => {
          if (user) {
            user
              .getPasswordAttributes()
              .then((pa) => {
                const token = this.crypt.genTimeLimitedToken(5);
                const sendPasswordResetMail = () => {
                  this.mailer
                    .sendPasswordReset(user, `${Config.WEB_URL}/auth/password-reset/${token.value}`)
                    .then(() => {
                      return res.status(StatusCodes.OK).json({
                        success: true,
                        message:
                          'A message has been sent to your email address. Follow the instructions to reset your password.'
                      });
                    })
                    .catch((err: any) => {
                      // Logger.Err(err);
                      return res.status(StatusCodes.BAD_REQUEST).json(err);
                    });
                };

                if (pa) {
                  pa.token = token.value;
                  pa.tokenExpire = token.expireDate;
                  pa.save()
                    .then(() => {
                      sendPasswordResetMail();
                    })
                    .catch((err: any) => {
                      // Logger.Err(err);
                      return res.status(StatusCodes.BAD_REQUEST).json(err);
                    });
                } else {
                  user
                    .createPasswordAttributes({
                      token: token.value,
                      tokenExpire: token.expireDate
                    })
                    .then(() => {
                      sendPasswordResetMail();
                    });
                }
              })
              .catch((err: any) => {
                // Logger.Err(err);
                return res.status(StatusCodes.BAD_REQUEST).json(err);
              });
          } else {
            res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: 'The following user does not exist! Please, provide correct email or login!'
            });
          }
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.BAD_REQUEST).json(err);
        });
    });

    this.router.post('/reset_password', (req: Request, res: Response<ApiResponse>) => {
      // Logger.Info(`Reseting new password...`);
      PasswordAttribute.findOne({
        where: {
          token: req.body.token,
          tokenExpire: {
            [Op.gt]: Date.now()
          }
        }
      })
        .then((pa) => {
          if (pa) {
            if (req.body.newPassword === req.body.verifyPassword) {
              pa.getUser()
                .then((user: User) => {
                  const passwordData = this.crypt.saltHashPassword(req.body.newPassword);
                  user.passwordHash = passwordData.passwordHash;
                  user.salt = passwordData.salt;
                  user
                    .save()
                    .then((updatedUser) => {
                      updatedUser
                        .getPasswordAttributes()
                        .then((updatedPa) => {
                          if (updatedPa) {
                            updatedPa.token = null;
                            updatedPa.tokenExpire = null;
                            updatedPa
                              .save()
                              .then(() => {
                                this.mailer
                                  .sendPasswordResetConfirmation(updatedUser)
                                  .then(() => {
                                    return res.status(StatusCodes.OK).json({
                                      success: true,
                                      message: 'You have successfully changed your password.'
                                    });
                                  })
                                  .catch((err: any) => {
                                    // Logger.Err(err);
                                    return res.status(StatusCodes.BAD_REQUEST).json(err);
                                  });
                              })
                              .catch((err: any) => {
                                // Logger.Err(err);
                                return res.status(StatusCodes.BAD_REQUEST).json(err);
                              });
                          }
                        })
                        .catch((err: any) => {
                          // Logger.Err(err);
                          return res.status(StatusCodes.BAD_REQUEST).json(err);
                        });
                    })
                    .catch((err: any) => {
                      // Logger.Err(err);
                      return res.status(StatusCodes.BAD_REQUEST).json(err);
                    });
                })
                .catch((err: any) => {
                  // Logger.Err(err);
                  return res.status(StatusCodes.BAD_REQUEST).json(err);
                });
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Passwords do not match' });
            }
          } else {
            res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: 'Your password reset token is invalid or has expired!'
            });
          }
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.BAD_REQUEST).json(err);
        });
    });

    this.router.get('/logout', async (req: Request, res: Response<ApiResponse>) => {
      // Logger.Info(`Logging user out...`);
      const cookies = parseCookies(req) as any;
      const { sessionId } = await this.jwtHelper.getDecoded(cookies.refresh_token);
      this.userController
        .removeSession(sessionId)
        .then(() => {
          // force cookie expiration
          const expires = new Date(1970);
          res.cookie('refresh_token', null, { httpOnly: true, expires });
          req.logout();
          res.status(StatusCodes.OK).json({ success: true, message: 'logged out' });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.BAD_REQUEST).json(err);
        });
    });

    return this.router;
  }

  private saveLogInAttempt(req: Request, user: User, isSuccess: boolean): Promise<UserSession> {
    const body = {} as UserSession;
    body.IP = req.ip;
    body.UserId = user.id;
    body.UA = req.headers['user-agent'];
    body.isSuccess = isSuccess;
    return UserSession.create({
      ...body
    });
  }
}
