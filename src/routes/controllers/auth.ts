import { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } from 'http-status-codes';
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import { Op, ValidationError, UniqueConstraintError } from 'sequelize';
import Crypt from '../../config/crypt';
import Mailer from '../../mailer/nodeMailerTemplates';
import JwtHelper from '../../helpers/jwtHelper';
import { JwtDecoded } from '../../models/JWTPayload';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserDBController } from '../../dbControllers/usersController';
import { parseCookies } from '../../utils/parseCookies';

@Controller('auth/')
export class AuthController {
  private userDbCtrl = new UserDBController();

  saveLogInAttempt(req: Request, user: db.User, isSuccess: boolean): Promise<db.UserSession> {
    const body = {} as db.UserSession;
    body.IP = req.ip;
    body.UserId = user.id;
    body.UA = req.headers['user-agent'];
    body.isSuccess = isSuccess;
    return db.UserSession.create({
      ...body
    });
  }

  @Post('register')
  private register(req: Request, res: Response) {
    Logger.Info(`Registering new user...`);
    const password = req.body.password ? req.body.password : Crypt.genRandomString(12);
    const passwordData = Crypt.saltHashPassword(password);

    const OrgDefaults: any = {
      Roles: [
        {
          keyString: 'admin'
        }
      ]
    };

    const Organization = {
      ...OrgDefaults,
      ...req.body.Organization,
      ...(!req.body.Organization.title && { title: `PRIVATE_ORG_FOR_${req.body.name}_${req.body.surname}` })
    };

    db.User.create(
      {
        email: req.body.email,
        login: req.body.login,
        passwordHash: passwordData.passwordHash,
        salt: passwordData.salt,
        name: req.body.name,
        surname: req.body.surname,
        // defaultLang: req.body.defaultLang,
        phone: req.body.phone,
        Organization,
        StateId: 1
      },
      {
        include: [
          {
            association: db.User.associations.Organization,
            include: [
              {
                association: db.Organization.associations.Roles
              }
            ]
          }
        ]
      }
    )
      .then(user => {
        // TODO: maybe change this, manually add privileges by root user.
        const adminR = user.Organization.Roles[0];

        db.Privilege.findAll()
          .then(privileges => {
            adminR
              .setPrivileges(privileges)
              .then(() => {
                adminR
                  .getPrivileges()
                  .then(rPrivileges => {
                    rPrivileges.forEach(privilege => {
                      privilege.RolePrivilege.add = true;
                      privilege.RolePrivilege.delete = true;
                      privilege.RolePrivilege.edit = true;
                      privilege.RolePrivilege.view = true;
                      privilege.RolePrivilege.save();
                    });
                    adminR
                      .addUser(user)
                      .then(() => {
                        const token = Crypt.genTimeLimitedToken(24 * 60);
                        user
                          .createPasswordAttributes({
                            token: token.value,
                            tokenExpire: token.expireDate,
                            passwordExpire: token.expireDate
                          })
                          .then(pa => {
                            Mailer.sendActivation(
                              user,
                              password,
                              `${process.env.WEB_URL}/auth/activate-account/${token.value}`
                            )
                              .then(() => {
                                return res.status(OK).json({
                                  success: true,
                                  message: 'Activation link has been sent'
                                });
                              })
                              .catch((err: any) => {
                                Logger.Err(err);
                                return res.status(BAD_REQUEST).json(err);
                              });
                          });
                      })
                      .catch((err: any) => {
                        Logger.Err(err);
                        return res.status(BAD_REQUEST).json(err);
                      });
                  })
                  .catch((err: any) => {
                    Logger.Err(err);
                    return res.status(BAD_REQUEST).json(err);
                  });
              })
              .catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err);
              });
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err);
          });
      })
      .catch(ValidationError, UniqueConstraintError, error => {
        Logger.Err(ValidationError);
        Logger.Err(UniqueConstraintError);
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Post('activate_account')
  private activateAccount(req: Request, res: Response) {
    Logger.Info(`Creating new user...`);
    db.PasswordAttribute.findOne({
      where: {
        token: req.body.token,
        tokenExpire: {
          [Op.gt]: Date.now()
        }
      }
    })
      .then(pa => {
        if (pa) {
          pa.getUser()
            .then(user => {
              user.StateId = 2;
              user
                .save()
                .then(user => {
                  user
                    .getPasswordAttributes()
                    .then(pa => {
                      if (pa) {
                        pa.token = null;
                        pa.tokenExpire = null;
                        pa.save()
                          .then(() => {
                            Mailer.sendActivationConfirmation(user)
                              .then(() => {
                                return res.status(OK).json({
                                  success: true,
                                  message: 'You account has been activated successfully!'
                                });
                              })
                              .catch((err: any) => {
                                Logger.Err(err);
                                return res.status(BAD_REQUEST).json(err);
                              });
                          })
                          .catch((err: any) => {
                            Logger.Err(err);
                            return res.status(BAD_REQUEST).json(err);
                          });
                      }
                    })
                    .catch((err: any) => {
                      Logger.Err(err);
                      return res.status(BAD_REQUEST).json(err);
                    });
                })
                .catch((err: any) => {
                  Logger.Err(err);
                  return res.status(BAD_REQUEST).json(err);
                });
            })
            .catch((err: any) => {
              Logger.Err(err);
              return res.status(BAD_REQUEST).json(err);
            });
        } else {
          return res.status(BAD_REQUEST).send({
            success: false,
            message: 'Your activation token is invalid or has expired!'
          });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Post('authenticate')
  private authenticate(req: Request, res: Response) {
    Logger.Info(`Authenticating web client...`);
    const loginOrEmail = req.body.login;
    const password = req.body.password;
    db.User.findOne({
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
      attributes: ['id', 'passwordHash', 'salt'],
      include: [
        {
          model: db.State
        }
      ]
    })
      .then(user => {
        if (!user) {
          return res.status(BAD_REQUEST).json({
            success: false,
            message: 'No user, or no user data!',
            statusCode: 3
          });
        }

        if (user.State.id === 1) {
          this.saveLogInAttempt(req, user, false).then(() => {
            return res.status(BAD_REQUEST).json({
              success: false,
              message: 'Account is not activated!',
              statusCode: 1
            });
          });
        } else if (user.State.id === 3) {
          this.saveLogInAttempt(req, user, false).then(() => {
            return res.status(BAD_REQUEST).json({
              success: false,
              message: 'Account is disabled!',
              statusCode: 2
            });
          });
        }

        const isMatch = Crypt.validatePassword(password, user.passwordHash, user.salt);
        if (isMatch) {
          this.saveLogInAttempt(req, user, true).then(userSession => {
            const access_token = JwtHelper.generateToken({
              type: 'access',
              payload: { userId: user.id, sessionId: userSession.id }
            });
            const refreshToken = JwtHelper.generateToken({
              type: 'refresh',
              payload: { userId: userSession.UserId, sessionId: userSession.id }
            });
            // set cookie for one year, it doest matter, because it has token that itself has an expiration date;
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            res.cookie('refresh_token', refreshToken, { httpOnly: true, expires });
            return res.status(OK).json(`JWT ${access_token}`);
          });
        } else {
          this.saveLogInAttempt(req, user, false).then(() => {
            return res.status(BAD_REQUEST).json({
              success: false,
              message: 'Password is not correct!',
              statusCode: 4
            });
          });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Get('refresh-session')
  private refreshSession(req: Request, res: Response) {
    Logger.Info(`Refreshing user session...`);
    const cookies = parseCookies(req);
    if (cookies['refresh_token']) {
      JwtHelper.getVerified({ type: 'refresh', token: cookies['refresh_token'] })
        .then(({ userId, sessionId }: JwtDecoded) => {
          const newToken = JwtHelper.generateToken({ type: 'access', payload: { userId, sessionId } });
          return res.status(OK).json(`JWT ${newToken}`);
        })
        .catch((err: TokenExpiredError) => {
          return res.status(FORBIDDEN).send(err);
        });
    } else {
      return res.status(UNAUTHORIZED).send({
        success: false,
        message: 'No refresh token!'
      });
    }
  }

  @Post('forgot_password')
  private forgotPassword(req: Request, res: Response) {
    Logger.Info(`Forget password requesting...`);
    const loginOrEmail = req.body.login;

    db.User.findOne({
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
      .then(user => {
        if (user) {
          user
            .getPasswordAttributes()
            .then(pa => {
              const token = Crypt.genTimeLimitedToken(5);
              const sendPasswordResetMail = () => {
                Mailer.sendPasswordReset(user, `${process.env.WEB_URL}/auth/password-reset/${token.value}`)
                  .then(() => {
                    return res.status(OK).json({
                      success: true,
                      message:
                        'A message has been sent to your email address. Follow the instructions to reset your password.'
                    });
                  })
                  .catch((err: any) => {
                    Logger.Err(err);
                    return res.status(BAD_REQUEST).json(err);
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
                    Logger.Err(err);
                    return res.status(BAD_REQUEST).json(err);
                  });
              } else {
                user
                  .createPasswordAttributes({
                    token: token.value,
                    tokenExpire: token.expireDate
                  })
                  .then(pa => {
                    sendPasswordResetMail();
                  });
              }
            })
            .catch((err: any) => {
              Logger.Err(err);
              return res.status(BAD_REQUEST).json(err);
            });
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: 'The following user does not exist! Please, provide correct email or login!'
          });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json({ err });
      });
  }

  @Post('reset_password')
  private resetPassword(req: Request, res: Response) {
    Logger.Info(`Reseting new password...`);
    db.PasswordAttribute.findOne({
      where: {
        token: req.body.token,
        tokenExpire: {
          [Op.gt]: Date.now()
        }
      }
    })
      .then(pa => {
        if (pa) {
          if (req.body.newPassword === req.body.verifyPassword) {
            pa.getUser()
              .then((user: db.User) => {
                const passwordData = Crypt.saltHashPassword(req.body.newPassword);
                user.passwordHash = passwordData.passwordHash;
                user.salt = passwordData.salt;
                user
                  .save()
                  .then(user => {
                    user
                      .getPasswordAttributes()
                      .then(pa => {
                        if (pa) {
                          pa.token = null;
                          pa.tokenExpire = null;
                          pa.save()
                            .then(() => {
                              Mailer.sendPasswordResetConfirmation(user)
                                .then(() => {
                                  return res.status(OK).json({
                                    success: true,
                                    message: 'You have successfully changed your password.'
                                  });
                                })
                                .catch((err: any) => {
                                  Logger.Err(err);
                                  return res.status(BAD_REQUEST).json(err);
                                });
                            })
                            .catch((err: any) => {
                              Logger.Err(err);
                              return res.status(BAD_REQUEST).json(err);
                            });
                        }
                      })
                      .catch((err: any) => {
                        Logger.Err(err);
                        return res.status(BAD_REQUEST).json(err);
                      });
                  })
                  .catch((err: any) => {
                    Logger.Err(err);
                    return res.status(BAD_REQUEST).json(err);
                  });
              })
              .catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err);
              });
          } else {
            res.status(BAD_REQUEST).json({ success: false, message: 'Passwords do not match' });
          }
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: 'Your password reset token is invalid or has expired!'
          });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Get('logout')
  private async create(req: Request, res: Response) {
    Logger.Info(`Logging user out...`);
    const cookies = parseCookies(req);
    const { sessionId } = await JwtHelper.getDecoded(cookies['refresh_token']);
    this.userDbCtrl
      .removeSession(sessionId)
      .then(() => {
        // force cookie expiration
        const expires = new Date(1970);
        res.cookie('refresh_token', null, { httpOnly: true, expires });
        req.logout();
        res.status(OK).json({ message: 'logged out' });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }
}
