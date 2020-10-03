import { OK, INTERNAL_SERVER_ERROR, FORBIDDEN, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { User, Organization, Asset } from '../../models';
import Passport from '../../config/passport';
import uploads from '../../multer/multerConfig';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jimp from 'jimp';
import { UserDBController } from '../../dbControllers/usersController';
import Crypt from '../../utils/crypt';
import Mailer from '../../mailer/nodeMailerTemplates';
import { CollectionApiResponse, ApiResponse, ItemApiResponse } from '../../models/apiResponse';
import { RequestWithQuery, CollectionQuery, RequestWithBody } from '../../models/apiRequest';
import { parseCookies } from '../../utils/parseCookies';
import JwtHelper from '../../helpers/jwtHelper';
import { JwtDecoded } from '../../models/JWTPayload';
import { TokenExpiredError } from 'jsonwebtoken';
import { Config } from '../../config';

@Controller('users/')
export class UserController {
  private unlinkAsync = promisify(fs.unlink);
  private userDbCtrl: UserDBController = new UserDBController();

  @Get('profile/')
  @Middleware([Passport.authenticate()])
  getProfile(req: Request, res: Response<User>) {
    Logger.Info(`Geting user profile...`);
    return res.status(OK).json(req.user);
  }

  @Get(':id')
  @Middleware([Passport.authenticate()])
  get(req: Request, res: Response<ItemApiResponse<User>>) {
    this.userDbCtrl
      .getById(req.params.id)
      .then((user: User) => {
        return res.status(OK).json({ success: true, data: user });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  getAll(req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<User>>) {
    const queryParams = req.query;
    const limit = parseInt(queryParams.pageSize);
    this.userDbCtrl
      .getAll(req.user, queryParams)
      .then((data) => {
        const pages = Math.ceil(data.count / limit);
        return res.status(OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(INTERNAL_SERVER_ERROR).json(err);
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  create(req: RequestWithBody<Partial<User>>, res: Response<ItemApiResponse<User>>) {
    this.userDbCtrl
      .create(req.body)
      .then((user: User) => {
        return res.status(OK).json({ success: true, message: 'User is created successfully!', data: user });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json({ success: false, message: 'There are some missing params!', data: null });
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  updateOne(req: RequestWithBody<Partial<User>>, res: Response<ItemApiResponse<User>>) {
    this.userDbCtrl
      .updateOne(req.body)
      .then((result) => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then((user: User) => {
              return res.status(OK).json({ success: true, message: 'User is updated successfully!', data: user });
            })
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(INTERNAL_SERVER_ERROR).json(error);
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  // TODO @IMalaniak check for multiple routes with the same logiс
  @Put('profile/')
  @Middleware([Passport.authenticate()])
  updateProfile(req: RequestWithBody<Partial<User>>, res: Response<ItemApiResponse<User>>) {
    this.userDbCtrl
      .updateOne(req.body)
      .then((result) => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then((user: User) => {
              return res
                .status(OK)
                .json({ success: true, message: 'Your profile is updated successfully!', data: user });
            })
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(INTERNAL_SERVER_ERROR).json(error);
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Post('change-password')
  @Middleware([Passport.authenticate()])
  changePassword(
    req: RequestWithBody<{ newPassword: string; verifyPassword: string; oldPassword: string; deleteSessions: boolean }>,
    res: Response<ApiResponse | TokenExpiredError>
  ) {
    Logger.Info(`Changing user password...`);

    if (req.body.newPassword === req.body.verifyPassword) {
      User.findByPk(req.user.id)
        .then((user) => {
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
                return res.status(INTERNAL_SERVER_ERROR).json(err);
              });
          };

          const isMatch = Crypt.validatePassword(req.body.oldPassword, user.passwordHash, user.salt);
          if (isMatch) {
            const passwordData = Crypt.saltHashPassword(req.body.newPassword);
            user.passwordHash = passwordData.passwordHash;
            user.salt = passwordData.salt;
            user
              .save()
              .then(() => {
                if (req.body.deleteSessions) {
                  const cookies = parseCookies(req) as any;

                  if (cookies.refresh_token) {
                    JwtHelper.getVerified({ type: 'refresh', token: cookies.refresh_token })
                      .then(({ userId, sessionId }: JwtDecoded) => {
                        this.userDbCtrl
                          .removeUserSessionsExept(userId, sessionId)
                          .then(() => {
                            sendPasswordResetConfirmation();
                          })
                          .catch((err: any) => {
                            Logger.Err(err);
                            return res.status(INTERNAL_SERVER_ERROR).json(err);
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
                return res.status(INTERNAL_SERVER_ERROR).json(err);
              });
          } else {
            return res
              .status(BAD_REQUEST)
              .json({ success: false, message: 'Current password you provided is not correct!' });
          }
        })
        .catch((err: any) => {
          Logger.Err(err);
          return res.status(INTERNAL_SERVER_ERROR).json(err);
        });
    } else {
      res.status(BAD_REQUEST).json({ success: false, message: 'New passwords do not match!' });
    }
  }

  @Post(':id/avatar')
  @Middleware([Passport.authenticate(), uploads.single('profile-pic-uploader')])
  setUserAvatar(req: Request, res: Response<ItemApiResponse<Asset>>) {
    if (req.file) {
      jimp.read(req.file.path).then((tpl) =>
        tpl
          .clone()
          .resize(100, jimp.AUTO)
          .write(req.file.destination + '/thumbnails/' + req.file.originalname)
      );
    }
    User.findByPk(req.params.id)
      .then((user) => {
        user
          .getAvatar()
          .then((avatar) => {
            if (avatar) {
              Asset.destroy({
                where: { id: avatar.id }
              })
                .then(() => {
                  const uploadsPath = path.join(__dirname, '../../uploads');
                  const destination = uploadsPath + avatar.location + '/' + avatar.title;
                  const thumbDestination = uploadsPath + avatar.location + '/thumbnails/' + avatar.title;
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
                            .then((newAv) => {
                              return res.status(OK).json({
                                success: true,
                                message: 'User profile picture is updated successfully!',
                                data: newAv
                              });
                            })
                            .catch((error: any) => {
                              Logger.Err(error);
                              return res.status(INTERNAL_SERVER_ERROR).json(error);
                            });
                        })
                        .catch((error: any) => {
                          Logger.Err(error);
                          return res.status(INTERNAL_SERVER_ERROR).json(error);
                        });
                    })
                    .catch((error: any) => {
                      Logger.Err(error);
                      return res.status(INTERNAL_SERVER_ERROR).json(error);
                    });
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(INTERNAL_SERVER_ERROR).json(error);
                });
            } else {
              const av = {
                title: req.file.originalname,
                location: req.file.destination.split('uploads')[1],
                type: req.file.mimetype
              };
              user
                .createAvatar(av)
                .then((newAv) => {
                  return res
                    .status(OK)
                    .json({ success: true, message: 'User profile picture is added successfully!', data: newAv });
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(INTERNAL_SERVER_ERROR).json(error);
                });
            }
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(INTERNAL_SERVER_ERROR).json(error);
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Delete(':id/avatar')
  @Middleware([Passport.authenticate()])
  deleteUserAvatar(req: Request, res: Response<ApiResponse>) {
    User.findByPk(req.params.id)
      .then((user) => {
        user
          .getAvatar()
          .then((avatar) => {
            if (avatar) {
              Asset.destroy({
                where: { id: avatar.id }
              })
                .then(() => {
                  const uploadsPath = path.join(__dirname, '../../uploads');
                  const destination = uploadsPath + avatar.location + '/' + avatar.title;
                  const thumbDestination = uploadsPath + avatar.location + '/thumbnails/' + avatar.title;
                  this.unlinkAsync(destination)
                    .then(() => {
                      this.unlinkAsync(thumbDestination)
                        .then(() => {
                          return res.status(OK).json({ success: true, message: 'Profile picture is deleted' });
                        })
                        .catch((error: any) => {
                          Logger.Err(error);
                          return res.status(INTERNAL_SERVER_ERROR).json(error);
                        });
                    })
                    .catch((error: any) => {
                      Logger.Err(error);
                      return res.status(INTERNAL_SERVER_ERROR).json(error);
                    });
                })
                .catch((error: any) => {
                  Logger.Err(error);
                  return res.status(INTERNAL_SERVER_ERROR).json(error);
                });
            }
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(INTERNAL_SERVER_ERROR).json(error);
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Put('updateUserState')
  @Middleware([Passport.authenticate()])
  updateUserState(req: RequestWithBody<Partial<User>>, res: Response<ItemApiResponse<User>>) {
    this.userDbCtrl
      .updateUserState(req.body)
      .then((result) => {
        if (result) {
          this.userDbCtrl
            .getById(req.body.id)
            .then((user) => {
              return res.status(OK).json({ success: true, message: 'User state is updated successfully!', data: user });
            })
            .catch((error: any) => {
              Logger.Err(error);
              return res.status(INTERNAL_SERVER_ERROR).json(error);
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  // TODO: @IMalaniak recreate this
  @Put('changeStateOfSelected')
  @Middleware([Passport.authenticate()])
  changeStateOfSelected(req: Request, res: Response<ApiResponse>) {
    Logger.Info(`Changing state of selected users...`);
    const promises = [];
    req.body.userIds.forEach((userId) => {
      promises.push(this.userDbCtrl.updateUserState(userId));
    });

    return Promise.all(promises)
      .then(() => {
        return res.status(OK).json({ success: true, message: 'Changed state of selected users!' });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  deleteOne(req: Request, res: Response<ApiResponse>) {
    this.userDbCtrl
      .deleteOne(req.params.id)
      .then((result) => {
        return res.status(OK).json({ success: true, message: `Deleted ${result} user` });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Post('invite/')
  @Middleware([Passport.authenticate()])
  inviteMany(req: RequestWithBody<Partial<User>[]>, res: Response<CollectionApiResponse<User>>) {
    Logger.Info(`Inviting users...`);
    const promises = [];

    req.body.forEach((user: User) => {
      promises.push(
        new Promise((resolve: (value: User) => void, reject) => {
          const password = Crypt.genRandomString(12);
          const passwordData = Crypt.saltHashPassword(password);
          user.passwordHash = passwordData.passwordHash;
          user.salt = passwordData.salt;
          user.OrganizationId = req.user.OrganizationId;
          user.login = user.fullname.replace(' ', '_');
          this.userDbCtrl
            .create(user)
            .then((u) => {
              const token = Crypt.genTimeLimitedToken(24 * 60);
              u.createPasswordAttributes({
                token: token.value,
                tokenExpire: token.expireDate,
                passwordExpire: token.expireDate
              })
                .then(() => {
                  Mailer.sendInvitation(u, password, `${Config.WEB_URL}/auth/activate-account/${token.value}`)
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
      .then((invitedUsers: User[]) => {
        return res
          .status(OK)
          .json({ success: true, message: 'Invitation have been sent successfully!', data: invitedUsers });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json({ success: false, message: 'There are some missing params!', data: null });
      });
  }

  @Delete('session/:id')
  @Middleware([Passport.authenticate()])
  deleteSession(req: Request, res: Response<ApiResponse>) {
    this.userDbCtrl
      .removeSession(req.params.id)
      .then(() => {
        return res.status(OK).json({ success: true, message: 'Session has been removed!' });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Put('session-multiple/:sessionIds')
  @Middleware([Passport.authenticate()])
  deleteMultipleSessions(req: Request, res: Response<ApiResponse>) {
    this.userDbCtrl
      .removeSession(req.body.sessionIds)
      .then((num) => {
        return res.status(OK).json({ success: true, message: `${num} sessions have been removed!` });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }

  @Put('org/:id')
  @Middleware([Passport.authenticate()])
  updateOrg(req: RequestWithBody<Partial<Organization>>, res: Response<ItemApiResponse<Organization>>) {
    this.userDbCtrl
      .editOrg(req.body)
      .then(() => {
        req.user
          .getOrganization()
          .then((org) => {
            return res.status(OK).json({ success: true, message: 'Organization is updated successfully!', data: org });
          })
          .catch((error: any) => {
            Logger.Err(error);
            return res.status(INTERNAL_SERVER_ERROR).json(error);
          });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(INTERNAL_SERVER_ERROR).json(error);
      });
  }
}
