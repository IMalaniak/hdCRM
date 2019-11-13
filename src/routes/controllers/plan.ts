import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import { Op, IncludeThroughOptions } from 'sequelize';
import Passport from '../../config/passport';
import uploads from '../../multer/multerConfig';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jimp from 'jimp';

@Controller('plans/')
export class PlanController {
  unlinkAsync = promisify(fs.unlink);
  // TODO: change to user type
  currentUser: any;

  @Get(':id')
  @Middleware([Passport.authenticate()])
  private get(req: Request, res: Response) {
    Logger.Info(`Selecting plan by id: ${req.params.id}...`);
    this.findPlanById(req.params.id)
      .then((plan: db.Plan) => {
        return res.status(OK).json(plan);
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Get('')
  @Middleware([Passport.authenticate()])
  private getAll(req: Request, res: Response) {
    Logger.Info(`Selecting all plans...`);
    // TODO: req.user type
    this.currentUser = req.user;

    const queryParams = req.query;
    const limit = parseInt(queryParams.pageSize);
    const offset = parseInt(queryParams.pageIndex) * limit;

    db.Plan.findAndCountAll({
      where: {
        OrganizationId: this.currentUser.OrganizationId
      },
      include: [
        {
          model: db.User,
          as: 'Creator',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ]
        },
        {
          model: db.User,
          as: 'Participants',
          attributes: { exclude: ['passwordHash', 'salt'] },
          through: {
            attributes: []
          },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ]
        },
        {
          model: db.Asset,
          as: 'Documents',
          through: {
            attributes: []
          }
        },
        {
          model: db.Stage,
          as: 'activeStage'
        },
        {
          model: db.Stage,
          as: 'Stages',
          through: {
            as: 'Details',
            attributes: { exclude: ['PlanId', 'StageId'] }
          } as IncludeThroughOptions
        }
      ],
      limit: limit,
      offset: offset,
      order: [
        [queryParams.sortIndex, queryParams.sortDirection.toUpperCase()]
        // TODO: sort
        // [db.Sequelize.literal(`"Stages->Details"."order" ASC`)]
      ],
      distinct: true
    })
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        // TODO: sort with sequelize query
        function sortByOrder(a, b) {
          return a.Details.order - b.Details.order;
        }
        data.rows.forEach(plan => {
          if (plan.Stages && plan.Stages.length > 0) {
            plan.Stages = plan.Stages.sort(sortByOrder);
          }
        });
        return res.status(OK).json({ list: data.rows, count: data.count, pages: pages });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err.toString());
      });
  }

  @Post('')
  @Middleware([Passport.authenticate()])
  private create(req: Request, res: Response) {
    Logger.Info(`Creating new plan...`);
    this.currentUser = req.user;
    const finish = function(planId: number) {
      this.findPlanById(planId)
        .then(plan => {
          return res.status(OK).json(plan);
        })
        .catch((err: any) => {
          Logger.Err(err);
          return res.status(BAD_REQUEST).json(err.toString());
        });
    };

    db.Plan.create({
      title: req.body.title,
      budget: req.body.budget,
      deadline: req.body.deadline,
      description: req.body.description,
      progress: 0,
      OrganizationId: this.currentUser.OrganizationId
    })
      .then(plan => {
        db.User.findByPk(req.body.CreatorId)
          .then(user => {
            plan
              .setCreator(user)
              .then(() => {
                db.Stage.findAll({
                  where: {
                    keyString: {
                      [Op.or]: ['created', 'inProgress', 'finished']
                    }
                  }
                })
                  .then(stages => {
                    // tslint:disable-next-line: forin
                    for (const i in stages) {
                      if (stages[i].keyString === 'created') {
                        plan.setActiveStage(stages[i]);
                      }
                      plan.addStage(stages[i], {
                        through: {
                          order: i,
                          completed: false
                        }
                      });
                    }

                    if (req.body.Participants) {
                      db.User.findAll({
                        where: {
                          [Op.or]: req.body.Participants
                        }
                      })
                        .then(users => {
                          plan
                            .setParticipants(users)
                            .then(() => {
                              finish(plan.id);
                            })
                            .catch((err: any) => {
                              Logger.Err(err);
                              return res.status(BAD_REQUEST).json(err.toString());
                            });
                        })
                        .catch((err: any) => {
                          Logger.Err(err);
                          return res.status(BAD_REQUEST).json(err.toString());
                        });
                    } else {
                      finish(plan.id);
                    }
                  })
                  .catch((err: any) => {
                    Logger.Err(err);
                    return res.status(BAD_REQUEST).json(err.toString());
                  });
              })
              .catch((err: any) => {
                Logger.Err(err);
                return res.status(BAD_REQUEST).json(err.toString());
              });
          })
          .catch((err: any) => {
            Logger.Err(err);
            return res.status(BAD_REQUEST).json(err.toString());
          });
      })
      .catch((err: any) => {
        Logger.Err(err);
        return res.status(BAD_REQUEST).json(err);
      });
  }

  @Put(':id')
  @Middleware([Passport.authenticate()])
  private updateOne(req: Request, res: Response) {
    Logger.Info(`Updating plan by id: ${req.params.id}...`);
    db.Plan.update(
      {
        title: req.body.title,
        description: req.body.description,
        budget: req.body.budget,
        deadline: req.body.deadline
      },
      {
        where: { id: req.body.id }
      }
    )
      .then(result => {
        if (result) {
          db.Plan.findByPk(req.body.id)
            .then(plan => {
              if (req.body.Participants) {
                db.User.findAll({
                  where: {
                    [Op.or]: req.body.Participants
                  }
                })
                  .then(users => {
                    plan.setParticipants(users).then(() => {
                      this.findPlanById(req.body.id)
                        .then(plan => {
                          return res.status(OK).json(plan);
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
              } else {
                return res.status(OK).json(plan);
              }
            })
            .catch((err: any) => {
              Logger.Err(err);
              return res.status(BAD_REQUEST).json(err);
            });
        }
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Put('updatePlanStages')
  @Middleware([Passport.authenticate()])
  private updatePlanStages(req: Request, res: Response) {
    Logger.Info(`Updating plan stages...`);
    db.Plan.findByPk(req.body.id)
      .then(plan => {
        const stageIds = req.body.Stages.map(stage => {
          return { id: stage.id };
        });
        db.Stage.findAll({
          where: {
            [Op.or]: stageIds
          }
        })
          .then(stages => {
            // TODO: stage details
            // stages = stages.map(stage => {
            //     const planStage = req.body.Stages.filter(reqStage => {
            //         return reqStage.id === stage.id;
            //     })[0];
            //     stage.PlanStages = {
            //         order: planStage.Details.order,
            //         description: planStage.Details.description,
            //         completed: planStage.Details.completed
            //     };
            //     return stage;
            // });
            plan
              .setStages(stages)
              .then(() => {
                this.findPlanById(req.body.id)
                  .then(plan => {
                    return res.status(OK).json(plan);
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
  }

  @Get('toNextStage/:id')
  @Middleware([Passport.authenticate()])
  private toNextStage(req: Request, res: Response) {
    db.Plan.findByPk(req.params.id, {
      attributes: ['id', 'activeStageId'],
      include: [
        {
          model: db.Stage,
          as: 'activeStage'
        },
        {
          model: db.Stage,
          as: 'Stages',
          through: {
            as: 'Details',
            attributes: { exclude: ['PlanId', 'StageId'] }
          } as IncludeThroughOptions
        }
      ],
      order: [db.Sequelize.col('order')]
    })
      .then(plan => {
        plan.Stages.forEach((stage, i) => {
          if (stage.id === plan.activeStageId) {
            stage.Details.completed = true;
            stage.Details.save()
              .then(stage => {
                if (plan.Stages[i + 1]) {
                  plan
                    .setActiveStage(plan.Stages[i + 1].id)
                    .then(() => {
                      this.findPlanById(req.params.id)
                        .then(plan => {
                          return res.status(OK).json(plan);
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
                  this.findPlanById(req.params.id)
                    .then(plan => {
                      return res.status(OK).json(plan);
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
        });
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  @Post('documents/:planId')
  @Middleware([Passport.authenticate(), uploads.single('uploader')])
  private setPlanDocument(req: Request, res: Response) {
    Logger.Info(`Uploading plan document: ${req.file.originalname}...`);
    // we use single because filepond send file by one
    const file = {
      title: req.file.originalname,
      location: req.file.destination.split('uploads')[1],
      type: req.file.mimetype
    };

    db.Plan.findByPk(req.params.planId, {
      attributes: ['id']
    })
      .then(plan => {
        plan
          .createDocument(file)
          .then(doc => {
            return res.status(OK).json(doc);
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

  @Delete('documents')
  @Middleware([Passport.authenticate()])
  private deletePlanDocument(req: Request, res: Response) {
    Logger.Info(`Deleting plan document by id: ${req.query.docId} where plan id: ${req.query.planId}...`);
    db.Plan.findByPk(req.query.planId, {
      attributes: ['id'],
      include: [
        {
          model: db.Asset,
          as: 'Documents',
          through: {
            where: { AssetId: req.query.docId },
            attributes: []
          }
        }
      ]
    })
      .then(plan => {
        const docToDelete = plan.Documents[0];
        db.Asset.destroy({
          where: {
            id: docToDelete.id
          }
        })
          .then(() => {
            // REDO to file server
            let destination = path.join(__dirname, '../../../uploads');
            destination = destination + docToDelete.location + '/' + docToDelete.title;
            this.unlinkAsync(destination)
              .then(() => {
                return res.status(OK).json({ success: true, message: 'doc deleted' });
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

  @Delete(':id')
  @Middleware([Passport.authenticate()])
  private deleteOne(req: Request, res: Response) {
    Logger.Info(`Deleting plan by id: ${req.params.id}...`);
    db.Plan.destroy({
      where: { id: req.params.id }
    })
      .then(result => {
        return res.status(OK).json(result);
      })
      .catch((error: any) => {
        Logger.Err(error);
        return res.status(BAD_REQUEST).json(error.toString());
      });
  }

  private findPlanById(planId: number | string): Promise<db.Plan> {
    return db.Plan.findByPk(planId, {
      include: [
        {
          model: db.User,
          as: 'Creator',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ]
        },
        {
          model: db.User,
          as: 'Participants',
          attributes: { exclude: ['passwordHash', 'salt'] },
          through: {
            attributes: []
          },
          include: [
            {
              model: db.Asset,
              as: 'avatar'
            }
          ]
        },
        {
          model: db.Asset,
          as: 'Documents',
          through: {
            attributes: []
          }
        },
        {
          model: db.Stage,
          as: 'activeStage'
        },
        {
          model: db.Stage,
          as: 'Stages',
          through: {
            as: 'Details',
            attributes: { exclude: ['PlanId', 'StageId'] }
          } as IncludeThroughOptions
        }
      ],
      order: [db.Sequelize.col('order')]
    });
  }
}
