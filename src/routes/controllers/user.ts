import { OK, BAD_REQUEST, FORBIDDEN } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';
import uploads from '../../multer/multerConfig';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jimp from 'jimp';
import { UserDBController } from '../../dbControllers/usersController';
import Crypt from '../../config/crypt';
import Mailer from '../../mailer/nodeMailerTemplates';
import { parseCookies } from '../../utils/parseCookies';
import JwtHelper from '../../helpers/jwtHelper';
import { JwtDecoded } from '../../models/JWTPayload';
import { TokenExpiredError } from 'jsonwebtoken';

@Controller('users/')
export class UserController {
  unlinkAsync = promisify(fs.unlink);
  private userDbCtrl: UserDBController = new UserDBController();

  @Get('profile/')
  @Middleware([Passport.authenticate()])
  private getProfile(req: Request, res: Response) {
    Logger.Info(`Geting user profile...`);
    return res.status(OK).json(req.user);
  }

  @Get(':id')
  @Middleware([Passport.authenticate()])
  private get(req: Request, res: Response) {
    this.userDbCtrl
      .getById(req.params.id)
      .then((user: db.User) => {
        return res.status(OK).json(user);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response) {
    const queryParams = req.query;
    const limit = parseInt(queryParams.pageSize);
    this.userDbCtrl
      .getAll(req.user, queryParams)
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        return res.status(OK).json({ list: data.rows, count: data.count, pages });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: Request, res: Response) {
    this.userDbCtrl
      .create(req.body)
      .then((user: db.User) => {
        return res.status(OK).json(user);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: Request, res: Response) {
    this.userDbCtrl
      .updateOne(req.body)
      .then(result => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then(user => res.status(OK).json(user))
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(BAD_REQUEST).json(error.toString());
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  // TODO @IMalaniak check for multiple routes with the same logiс
  @Put('profile/')
  @Middleware([Passport.authenticate()])
  private updateProfile(req: Request, res: Response) {
    this.userDbCtrl
      .updateOne(req.body)
      .then(result => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then(user => res.status(OK).json(user))
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(BAD_REQUEST).json(error.toString());
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Post('change-password')
  @Middleware([Passport.authenticate()])
  private changePassword(req: Request, res: Response) {
    Logger.Info(`Changing user password...`);

    if (req.body.newPassword === req.body.verifyPassword) {
      db.User.findByPk(req.user.id)
        .then(user => {
          const sendPasswordResetConfirmation = () => {
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
          };

          const isMatch = Crypt.validatePassword(req.body.oldPassword, user.passwordHash, user.salt);
          if (isMatch) {
            const passwordData = Crypt.saltHashPassword(req.body.newPassword);
            user.passwordHash = passwordData.passwordHash;
            user.salt = passwordData.salt;
            user
              .save()
              .then(user => {
                if (req.body.deleteSessions) {
                  const cookies = parseCookies(req);

                  if (cookies['refresh_session']) {
                    JwtHelper.getVerified({ type: 'refresh', token: cookies['refresh_token'] })
                      .then(({ userId, sessionId }: JwtDecoded) => {
                        this.userDbCtrl.removeUserSessionsExept(userId, sessionId).then(() => {
                          sendPasswordResetConfirmation();
                        });
                      })
                      .catch((err: TokenExpiredError) => {
                        return res.status(FORBIDDEN).send(err);
                      });
                  }
                } else {
                  sendPasswordResetConfirmation();
                }
              })
              .catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err);
              });
          } else {
            return res.status(BAD_REQUEST).json({ success: false, message: 'Old password is not correct' });
          }
        })
        .catch((err: any) => {
          Logger.Err(err);
          return res.status(BAD_REQUEST).json(err);
        });
    } else {
      res.status(BAD_REQUEST).json({ success: false, message: 'Passwords do not match' });
    }
  }

  @Post(':id/avatar')
  @Middleware([Passport.authenticate(), uploads.single('profile-pic-uploader')])
  private setUserAvatar(req: Request, res: Response) {
    if (req.file) {
      jimp.read(req.file.path).then(tpl =>
        tpl
          .clone()
          .resize(100, jimp.AUTO)
          .write(req.file.destination + '/thumbnails/' + req.file.originalname)
      );
    }
    db.User.findByPk(req.params.id)
      .then(user => {
        user
          .getAvatar()
          .then(avatar => {
            if (avatar) {
              db.Asset.destroy({
                where: { id: avatar.id }
              })
                .then(() => {
                  const uploads = path.join(__dirname, '../../../uploads');
                  const destination = uploads + avatar.location + '/' + avatar.title;
                  const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
                  this.unlinkAsync(destination)
                    .then(() => {
                      this.unlinkAsync(thumbDestination)
                        .then(() => {
                          const av = {
                            title: req.file.originalname,
                            location: req.file.destination.split('uploads')[1],
                            type: req.file.mimetype
                          };
                          user
                            .createAvatar(av)
                            .then(newAv => {
                              return res.status(OK).json(newAv);
                            })
                            .catch((error: any) => {
                              Logger.Err(error);
                              return res.status(BAD_REQUEST).json(error.toString());
                            });
                        })
                        .catch((error: any) => {
                          Logger.Err(error);
                          return res.status(BAD_REQUEST).json(error.toString());
                        });
                    })
                    .catch((error: any) => {
                      Logger.Err(error);
                      return res.status(BAD_REQUEST).json(error.toString());
                    });
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(BAD_REQUEST).json(error.toString());
                });
            } else {
              const av = {
                title: req.file.originalname,
                location: req.file.destination.split('uploads')[1],
                type: req.file.mimetype
              };
              user
                .createAvatar(av)
                .then(newAv => {
                  return res.status(OK).json(newAv);
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(BAD_REQUEST).json(error.toString());
                });
            }
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Delete(':id/avatar')
  @Middleware([Passport.authenticate()])
  private deleteUserAvatar(req: Request, res: Response) {
    db.User.findByPk(req.params.id)
      .then(user => {
        user
          .getAvatar()
          .then(avatar => {
            if (avatar) {
              db.Asset.destroy({
                where: { id: avatar.id }
              })
                .then(() => {
                  const uploads = path.join(__dirname, '../../../uploads');
                  const destination = uploads + avatar.location + '/' + avatar.title;
                  const thumbDestination = uploads + avatar.location + '/thumbnails/' + avatar.title;
                  this.unlinkAsync(destination)
                    .then(() => {
                      this.unlinkAsync(thumbDestination)
                        .then(() => {
                          return res.status(OK).json({ success: true, message: 'avatar deleted' });
                        })
                        .catch((error: any) => {
                          Logger.Err(error);
                          return res.status(BAD_REQUEST).json(error.toString());
                        });
                    })
                    .catch((error: any) => {
                      Logger.Err(error);
                      return res.status(BAD_REQUEST).json(error.toString());
                    });
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(BAD_REQUEST).json(error.toString());
                });
            }
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('updateUserState')
  @Middleware([Passport.authenticate()])
  private updateUserState(req: Request, res: Response) {
    this.userDbCtrl
      .updateUserState(req.body)
      .then(result => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then(user => {
              return res.status(OK).json(user);
            })
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(BAD_REQUEST).json(error.toString());
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('changeStateOfSelected')
  @Middleware([Passport.authenticate()])
  private changeStateOfSelected(req: Request, res: Response) {
    Logger.Info(`Changing state of selected users...`);
    const promises = [];
    req.body.userIds.forEach(userId => {
      promises.push(this.userDbCtrl.updateUserState(userId));
    });

    return Promise.all(promises)
      .then(result => {
        return res.status(OK).json({ status: 'ok' });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response) {
    this.userDbCtrl
      .deleteOne(req.params.id)
      .then(result => {
        return res.status(OK).json(result);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Post('invite/')
  @Middleware([Passport.authenticate()])
  private inviteMany(req: Request, res: Response) {
    Logger.Info(`Inviting users...`);
    const promises = [];

    req.body.forEach((user: db.User) => {
      promises.push(
        new Promise((resolve, reject) => {
          const password = Crypt.genRandomString(12);
          const passwordData = Crypt.saltHashPassword(password);
          user.passwordHash = passwordData.passwordHash;
          user.salt = passwordData.salt;
          user.OrganizationId = req.user.OrganizationId;
          user.StateId = 1;
          user.login = user.fullname.replace(' ', '_');
          this.userDbCtrl
            .create(user)
            .then(u => {
              const token = Crypt.genTimeLimitedToken(24 * 60);
              u.createPasswordAttributes({
                token: token.value,
                tokenExpire: token.expireDate,
                passwordExpire: token.expireDate
              })
                .then(() => {
                  Mailer.sendInvitation(u, password, `${process.env.WEB_URL}/auth/activate-account/${token.value}`)
                    .then(() => {
                      resolve(u);
                    })
                    .catch((err: any) => {
                      reject(err);
                    });
                })
                .catch((err: any) => {
                  reject(err);
                });
            })
            .catch((err: any) => {
              reject(err);
            });
        })
      );
    });

    Promise.all(promises)
      .then(response => {
        return res.status(OK).json(response);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Delete('session/:id')
  @Middleware([Passport.authenticate()])
  private deleteSession(req: Request, res: Response) {
    this.userDbCtrl
      .removeSession(req.params.id)
      .then(response => {
        return res.status(OK).json(response);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('session-multiple/:sessionIds')
  @Middleware([Passport.authenticate()])
  private deleteMultipleSessions(req: Request, res: Response) {
    this.userDbCtrl
      .removeSession(req.body.sessionIds)
      .then(response => {
        return res.status(OK).json(response);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('org/:id')
  @Middleware([Passport.authenticate()])
  private updateOrg(req: Request, res: Response) {
    this.userDbCtrl
      .editOrg(req.body)
      .then(() => {
        req.user
          .getOrganization()
          .then(org => {
            return res.status(OK).json(org);
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(BAD_REQUEST).json(error.toString());
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }
}
