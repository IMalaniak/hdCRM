import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jimp from 'jimp';
import { TokenExpiredError } from 'jsonwebtoken';

import {
  User,
  Organization,
  Asset,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithQuery,
  CollectionQuery,
  RequestWithBody,
  JwtDecoded,
  UserCreationAttributes,
  UserAttributes,
  OrganizationAttributes
} from '../models';
import { UserController } from '../controllers';
import uploads from '../multer/multerConfig';
import { Crypt } from '../utils/crypt';
import { Mailer } from '../mailer/nodeMailerTemplates';
import { parseCookies } from '../utils/parseCookies';
import { JwtHelper } from '../helpers/jwtHelper';
import { Config } from '../config';

@Service()
export class UserRoutes {
  private unlinkAsync = promisify(fs.unlink);

  private router: Router = Router();

  constructor(
    private readonly userController: UserController,
    private readonly jwtHelper: JwtHelper,
    private readonly mailer: Mailer,
    private readonly crypt: Crypt
  ) {}

  public register(): Router {
    this.router.get('/profile/', (req: Request, res: Response<User>) => {
      // Logger.Info(`Geting user profile...`);
      return res.status(StatusCodes.OK).json(req.user);
    });

    this.router.get('/:id', (req: Request, res: Response<ItemApiResponse<User>>) => {
      this.userController
        .getById(req.params.id)
        .then((user: User) => {
          return res.status(StatusCodes.OK).json({ success: true, data: user });
        })
        .catch((err: any) => {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.get('/', (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<User>>) => {
      const queryParams = req.query;
      const limit = parseInt(queryParams.pageSize);
      this.userController
        .getAll(req.user, queryParams)
        .then((data) => {
          const pages = Math.ceil(data.count / limit);
          return res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.post('/', (req: RequestWithBody<UserCreationAttributes>, res: Response<ItemApiResponse<User>>) => {
      this.userController
        .create(req.body)
        .then((user: User) => {
          return res
            .status(StatusCodes.OK)
            .json({ success: true, message: 'User is created successfully!', data: user });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.put('/:id', (req: RequestWithBody<UserAttributes>, res: Response<ItemApiResponse<User>>) => {
      this.userController
        .updateOne(req.body)
        .then((result) => {
          if (result) {
            this.userController
              .getById(req.body.id)
              .then((user: User) => {
                return res
                  .status(StatusCodes.OK)
                  .json({ success: true, message: 'User is updated successfully!', data: user });
              })
              .catch((error: any) => {
                // Logger.Err(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
              });
          }
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    // TODO @IMalaniak check for multiple routes with the same logiс
    this.router.put('/profile/', (req: RequestWithBody<UserAttributes>, res: Response<ItemApiResponse<User>>) => {
      this.userController
        .updateOne(req.body)
        .then((result) => {
          if (result) {
            this.userController
              .getById(req.body.id)
              .then((user: User) => {
                return res
                  .status(StatusCodes.OK)
                  .json({ success: true, message: 'Your profile is updated successfully!', data: user });
              })
              .catch((error: any) => {
                // Logger.Err(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
              });
          }
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.post(
      '/change-password',
      (
        req: RequestWithBody<{
          newPassword: string;
          verifyPassword: string;
          oldPassword: string;
          deleteSessions: boolean;
        }>,
        res: Response<BaseResponse | TokenExpiredError>
      ) => {
        // Logger.Info(`Changing user password...`);

        if (req.body.newPassword === req.body.verifyPassword) {
          User.findByPk(req.user.id)
            .then((user) => {
              const sendPasswordResetConfirmation = () => {
                this.mailer
                  .sendPasswordResetConfirmation(user)
                  .then(() => {
                    return res.status(StatusCodes.OK).json({
                      success: true,
                      message: 'You have successfully changed your password.'
                    });
                  })
                  .catch((err: any) => {
                    // Logger.Err(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                  });
              };

              const isMatch = this.crypt.validatePassword(req.body.oldPassword, user.passwordHash, user.salt);
              if (isMatch) {
                const passwordData = this.crypt.saltHashPassword(req.body.newPassword);
                user.passwordHash = passwordData.passwordHash;
                user.salt = passwordData.salt;
                user
                  .save()
                  .then(() => {
                    if (req.body.deleteSessions) {
                      const cookies = parseCookies(req) as any;

                      if (cookies.refresh_token) {
                        this.jwtHelper
                          .getVerified({ type: 'refresh', token: cookies.refresh_token })
                          .then(({ userId, sessionId }: JwtDecoded) => {
                            this.userController
                              .removeUserSessionsExept(userId, sessionId)
                              .then(() => {
                                sendPasswordResetConfirmation();
                              })
                              .catch((err: any) => {
                                // Logger.Err(err);
                                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                              });
                          })
                          .catch((err: TokenExpiredError) => {
                            return res.status(StatusCodes.FORBIDDEN).send(err);
                          });
                      }
                    } else {
                      sendPasswordResetConfirmation();
                    }
                  })
                  .catch((err: any) => {
                    // Logger.Err(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                  });
              } else {
                return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({ success: false, message: 'Current password you provided is not correct!' });
              }
            })
            .catch((err: any) => {
              // Logger.Err(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'New passwords do not match!' });
        }
      }
    );

    this.router.post(
      '/:id/avatar',
      uploads.single('profile-pic-uploader'),
      (req: Request, res: Response<ItemApiResponse<Asset>>) => {
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
                                  return res.status(StatusCodes.OK).json({
                                    success: true,
                                    message: 'User profile picture is updated successfully!',
                                    data: newAv
                                  });
                                })
                                .catch((error: any) => {
                                  // Logger.Err(error);
                                  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                                });
                            })
                            .catch((error: any) => {
                              // Logger.Err(error);
                              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                            });
                        })
                        .catch((error: any) => {
                          // Logger.Err(error);
                          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                        });
                    })
                    .catch((error: any) => {
                      // Logger.Err(error);
                      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
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
                        .status(StatusCodes.OK)
                        .json({ success: true, message: 'User profile picture is added successfully!', data: newAv });
                    })
                    .catch((error: any) => {
                      // Logger.Err(error);
                      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                    });
                }
              })
              .catch((error: any) => {
                // Logger.Err(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
              });
          })
          .catch((error: any) => {
            // Logger.Err(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
          });
      }
    );

    this.router.delete('/:id/avatar', (req: Request, res: Response<BaseResponse>) => {
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
                            return res
                              .status(StatusCodes.OK)
                              .json({ success: true, message: 'Profile picture is deleted' });
                          })
                          .catch((error: any) => {
                            // Logger.Err(error);
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                          });
                      })
                      .catch((error: any) => {
                        // Logger.Err(error);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                      });
                  })
                  .catch((error: any) => {
                    // Logger.Err(error);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                  });
              }
            })
            .catch((error: any) => {
              // Logger.Err(error);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.put(
      '/updateUserState',
      (req: RequestWithBody<UserAttributes>, res: Response<ItemApiResponse<User>>) => {
        this.userController
          .updateUserState(req.body)
          .then((result) => {
            if (result) {
              this.userController
                .getById(req.body.id)
                .then((user) => {
                  return res
                    .status(StatusCodes.OK)
                    .json({ success: true, message: 'User state is updated successfully!', data: user });
                })
                .catch((error: any) => {
                  // Logger.Err(error);
                  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
                });
            }
          })
          .catch((error: any) => {
            // Logger.Err(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
          });
      }
    );

    // TODO: @IMalaniak recreate this
    this.router.put('/changeStateOfSelected', (req: Request, res: Response<BaseResponse>) => {
      // Logger.Info(`Changing state of selected users...`);
      const promises = [];
      req.body.userIds.forEach((userId) => {
        promises.push(this.userController.updateUserState(userId));
      });

      return Promise.all(promises)
        .then(() => {
          return res.status(StatusCodes.OK).json({ success: true, message: 'Changed state of selected users!' });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.delete('/:id', (req: Request, res: Response<BaseResponse>) => {
      this.userController
        .deleteOne(req.params.id)
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} user` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.post(
      '/invite',
      (req: RequestWithBody<UserAttributes[]>, res: Response<CollectionApiResponse<User>>) => {
        // Logger.Info(`Inviting users...`);
        const promises = [];

        req.body.forEach((user: UserAttributes) => {
          promises.push(
            new Promise((resolve: (value: User) => void, reject) => {
              const password = this.crypt.genRandomString(12);
              const passwordData = this.crypt.saltHashPassword(password);
              user.passwordHash = passwordData.passwordHash;
              user.salt = passwordData.salt;
              user.OrganizationId = req.user.OrganizationId;
              user.login = user.fullname.replace(' ', '_');
              this.userController
                .create(user)
                .then((u) => {
                  const token = this.crypt.genTimeLimitedToken(24 * 60);
                  u.createPasswordAttributes({
                    token: token.value,
                    tokenExpire: token.expireDate,
                    passwordExpire: token.expireDate
                  })
                    .then(() => {
                      this.mailer
                        .sendInvitation(u, password, `${Config.WEB_URL}/auth/activate-account/${token.value}`)
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
              .status(StatusCodes.OK)
              .json({ success: true, message: 'Invitation have been sent successfully!', data: invitedUsers });
          })
          .catch(() => {
            // Logger.Err(error);
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ success: false, message: 'There are some missing params!', data: null });
          });
      }
    );

    this.router.delete('/session/:id', (req: Request, res: Response<BaseResponse>) => {
      this.userController
        .removeSession(req.params.id)
        .then(() => {
          return res.status(StatusCodes.OK).json({ success: true, message: 'Session has been removed!' });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.put('/session-multiple/:sessionIds', (req: Request, res: Response<BaseResponse>) => {
      this.userController
        .removeSession(req.body.sessionIds)
        .then((num) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `${num} sessions have been removed!` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.put(
      '/org/:id',
      (req: RequestWithBody<OrganizationAttributes>, res: Response<ItemApiResponse<Organization>>) => {
        this.userController
          .editOrg(req.body)
          .then(() => {
            req.user
              .getOrganization()
              .then((org) => {
                return res
                  .status(StatusCodes.OK)
                  .json({ success: true, message: 'Organization is updated successfully!', data: org });
              })
              .catch((error: any) => {
                // Logger.Err(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
              });
          })
          .catch((error: any) => {
            // Logger.Err(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
          });
      }
    );

    return this.router;
  }
}
