import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import { Op, ValidationError, UniqueConstraintError } from 'sequelize';
import Crypt from '../../config/crypt';
import Mailer from '../../mailer/nodeMailerTemplates';
import jwt from 'jsonwebtoken';

@Controller('auth/')
export class AuthController {
  saveLogInAttempt(req: Request, user: db.User, isSuccess: boolean): Promise<void> {
    const defaults: any = {};
    defaults.IP = req.connection.remoteAddress;
    if (isSuccess) {
      defaults.dateLastLoggedIn = new Date();
    } else {
      defaults.dateUnsuccessfulLogIn = new Date();
    }
    return db.UserLoginHistory.findOrCreate({
      where: {
        UserId: user.id
      },
      defaults
    }).then(([uLogHistItem, created]) => {
      if (!created) {
        uLogHistItem.IP = req.connection.remoteAddress;
        if (isSuccess) {
          uLogHistItem.dateLastLoggedIn = new Date();
        } else {
          uLogHistItem.dateUnsuccessfulLogIn = new Date();
        }
        uLogHistItem.save();
      }
    });
  }

  @Post('register')
  private register(req: Request, res: Response) {
    Logger.Info(`Registering new user...`);
    const password = req.body.password ? req.body.password : Crypt.genRandomString(12);
    const passwordData = Crypt.saltHashPassword(password);

    const OrgDefaults: any = {
      title: `PRIVATE_ORG_FOR_${req.body.name}_${req.body.surname}`,
      Roles: [
        {
          keyString: 'admin'
        }
      ]
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
        Organization: { ...OrgDefaults, ...req.body.Organization },
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
                adminR.getPrivileges().then(rPrivileges => {
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
                        Mailer.sendActivation(user, password, `${process.env.URL}/auth/activate-account/${token.value}`)
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
                                  message: 'Successful activation!'
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
          return res.status(BAD_REQUEST).json({
            success: false,
            message: 'Activation token is invalid or has expired!'
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
      include: [
        {
          model: db.Organization
        },
        {
          model: db.Role,
          through: {
            attributes: []
          },
          required: false,
          include: [
            {
              model: db.Privilege,
              through: {
                attributes: ['view', 'edit', 'add', 'delete']
              },
              required: false
            }
          ]
        },
        {
          model: db.State
        },
        {
          model: db.Asset,
          as: 'avatar',
          required: false
        },
        {
          model: db.UserLoginHistory,
          required: false
        },
        {
          model: db.Department,
          required: false
        },
        {
          model: db.PasswordAttribute,
          as: 'PasswordAttributes',
          attributes: ['updatedAt', 'passwordExpire'],
          required: false
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
          const tmpUser: any = {
            id: user.id,
            login: user.login,
            name: user.name,
            surname: user.surname,
            fullname: user.fullname,
            email: user.email,
            defaultLang: user.defaultLang,
            avatar: user.avatar,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            Organization: user.Organization,
            OrganizationId: user.OrganizationId
          };

          if (user.Roles && user.Roles.length > 0) {
            tmpUser.Roles = user.Roles;
          }

          if (user.UserLoginHistory) {
            tmpUser.lastSessionData = user.UserLoginHistory;
          }

          if (user.Department) {
            tmpUser.Department = user.Department;
          }

          if (user.PasswordAttributes) {
            tmpUser.PasswordAttributes = user.PasswordAttributes;
          }

          const token = jwt.sign(tmpUser, process.env.SECRET, {
            expiresIn: 86400 // 86400s = 1 day //604800s = 1 week
          });

          tmpUser.token = `JWT ${token}`;

          this.saveLogInAttempt(req, user, true).then(() => {
            res.cookie('jwt', token);
            return res.status(OK).json(tmpUser);
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
                Mailer.sendPasswordReset(user, `${process.env.URL}/auth/password-reset/${token.value}`)
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
          res.status(BAD_REQUEST).json({ success: false, message: 'no_user' });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
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
                                    message: 'New password is set!'
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
            message: 'Password reset token is invalid or has expired!'
          });
        }
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Get('logout')
  private create(req: Request, res: Response) {
    Logger.Info(`Logging user out...`);
    req.logout();
    res.status(OK).json({message: 'logged out'});
  }
}
