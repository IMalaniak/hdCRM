import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Op, IncludeThroughOptions } from 'sequelize';

import {
  Plan,
  User,
  Asset,
  Stage,
  Sequelize,
  CollectionApiResponse,
  BaseResponse,
  ItemApiResponse,
  RequestWithQuery,
  CollectionQuery,
  RequestWithBody
} from '../models';
import uploads from '../multer/multerConfig';

@Service()
export class PlanRoutes {
  private unlinkAsync = promisify(fs.unlink);
  private router: Router = Router();

  public register(): Router {
    this.router.get('/:id', (req: Request<{ id: string }>, res: Response<ItemApiResponse<Plan>>) => {
      // Logger.Info(`Selecting plan by id: ${req.params.id}...`);
      this.findPlanById(req.params.id)
        .then((plan: Plan) => {
          return res.status(StatusCodes.OK).json({ success: true, data: plan });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.get('/', (req: RequestWithQuery<CollectionQuery>, res: Response<CollectionApiResponse<Plan>>) => {
      // Logger.Info(`Selecting all plans...`);

      const { pageIndex, pageSize, sortIndex, sortDirection } = req.query;
      const limit = parseInt(pageSize);
      const offset = parseInt(pageIndex) * limit;

      Plan.findAndCountAll({
        where: {
          OrganizationId: req.user.OrganizationId
        },
        include: [
          {
            model: User as any,
            as: 'Creator',
            attributes: { exclude: ['passwordHash', 'salt'] },
            include: [
              {
                model: Asset as any,
                as: 'avatar'
              }
            ]
          },
          {
            model: User as any,
            as: 'Participants',
            attributes: { exclude: ['passwordHash', 'salt'] },
            through: {
              attributes: []
            },
            include: [
              {
                model: Asset as any,
                as: 'avatar'
              }
            ]
          },
          {
            model: Asset as any,
            as: 'Documents',
            through: {
              attributes: []
            }
          },
          {
            model: Stage as any,
            as: 'activeStage'
          },
          {
            model: Stage as any,
            as: 'Stages',
            through: {
              as: 'Details',
              attributes: { exclude: ['PlanId', 'StageId'] }
            } as IncludeThroughOptions
          }
        ],
        limit,
        offset,
        order: [
          [sortIndex, sortDirection.toUpperCase()]
          // TODO: sort
          // [Sequelize.literal(`"Stages->Details"."order" ASC`)]
        ],
        distinct: true
      })
        .then((data) => {
          const pages = Math.ceil(data.count / limit);
          // TODO: sort with sequelize query
          function sortByOrder(a, b) {
            return a.Details.order - b.Details.order;
          }
          data.rows.forEach((plan) => {
            if (plan.Stages && plan.Stages.length > 0) {
              plan.Stages = plan.Stages.sort(sortByOrder);
            }
          });
          return res.status(StatusCodes.OK).json({ success: true, data: data.rows, resultsNum: data.count, pages });
        })
        .catch((err: any) => {
          // Logger.Err(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        });
    });

    this.router.post('/', (req: RequestWithBody<Partial<Plan>>, res: Response<ItemApiResponse<Plan>>) => {
      // Logger.Info(`Creating new plan...`);
      const finish = (planId: number) => {
        this.findPlanById(planId)
          .then((plan) => {
            return res.status(StatusCodes.OK).json({ success: true, message: 'Plan created successfully', data: plan });
          })
          .catch((err: any) => {
            // Logger.Err(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
          });
      };

      Plan.create({
        title: req.body.title,
        budget: req.body.budget,
        deadline: req.body.deadline,
        description: req.body.description,
        progress: 0,
        OrganizationId: req.user.OrganizationId,
        CreatorId: req.user.id
      })
        .then((plan) => {
          Stage.findAll({
            where: {
              keyString: {
                [Op.or]: ['created', 'inProgress', 'finished']
              }
            }
          })
            .then((stages) => {
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
                User.findAll({
                  where: {
                    [Op.or]: req.body.Participants as { id: number }[]
                  }
                })
                  .then((users) => {
                    plan
                      .setParticipants(users)
                      .then(() => {
                        finish(plan.id);
                      })
                      .catch((err: any) => {
                        // Logger.Err(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                      });
                  })
                  .catch((err: any) => {
                    // Logger.Err(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                  });
              } else {
                finish(plan.id);
              }
            })
            .catch((err: any) => {
              // Logger.Err(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            });
        })
        .catch(() => {
          // Logger.Err(err);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'There are some missing params!', data: null });
        });
    });

    this.router.put('/:id', (req: RequestWithBody<Partial<Plan>>, res: Response<ItemApiResponse<Plan>>) => {
      // Logger.Info(`Updating plan by id: ${req.params.id}...`);
      Plan.update(
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
        .then((result) => {
          if (result) {
            Plan.findByPk(req.body.id)
              .then((plan) => {
                if (req.body.Participants) {
                  User.findAll({
                    where: {
                      [Op.or]: req.body.Participants as { id: number }[]
                    }
                  })
                    .then((users) => {
                      plan.setParticipants(users).then(() => {
                        this.findPlanById(req.body.id)
                          .then((updatedPlan) => {
                            return res
                              .status(StatusCodes.OK)
                              .json({ success: true, message: 'Plan is updated successfully!', data: updatedPlan });
                          })
                          .catch((err: any) => {
                            // Logger.Err(err);
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                          });
                      });
                    })
                    .catch((err: any) => {
                      // Logger.Err(err);
                      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                    });
                } else {
                  return res
                    .status(StatusCodes.OK)
                    .json({ success: true, message: 'Plan is updated successfully!', data: plan });
                }
              })
              .catch((err: any) => {
                // Logger.Err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
              });
          }
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.put(
      '/updatePlanStages',
      (req: RequestWithBody<Partial<Plan>>, res: Response<ItemApiResponse<Plan>>) => {
        // Logger.Info(`Updating plan stages...`);
        Plan.findByPk(req.body.id)
          .then((plan) => {
            const stageIds = req.body.Stages.map((stage) => {
              return { id: stage.id };
            });
            Stage.findAll({
              where: {
                [Op.or]: stageIds
              }
            })
              .then((stages) => {
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
                      .then((updatedPlan) => {
                        return res
                          .status(StatusCodes.OK)
                          .json({ success: true, message: 'Plan is updated successfully!', data: updatedPlan });
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
      }
    );

    this.router.get('/toNextStage/:id', (req: Request, res: Response) => {
      Plan.findByPk(req.params.id, {
        attributes: ['id', 'activeStageId'],
        include: [
          {
            model: Stage as any,
            as: 'activeStage'
          },
          {
            model: Stage as any,
            as: 'Stages',
            through: {
              as: 'Details',
              attributes: { exclude: ['PlanId', 'StageId'] }
            } as IncludeThroughOptions
          }
        ],
        order: [Sequelize.col('order')]
      })
        .then((plan) => {
          plan.Stages.forEach((stage, i) => {
            if (stage.id === plan.activeStageId) {
              stage.Details.completed = true;
              stage.Details.save()
                .then(() => {
                  if (plan.Stages[i + 1]) {
                    plan
                      .setActiveStage(plan.Stages[i + 1].id)
                      .then(() => {
                        this.findPlanById(req.params.id)
                          .then((updatedPlan) => {
                            return res.status(StatusCodes.OK).json(updatedPlan);
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
                    this.findPlanById(req.params.id)
                      .then((updatedPlan) => {
                        return res.status(StatusCodes.OK).json(updatedPlan);
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
          });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    this.router.post(
      '/documents/:planId',
      uploads.single('uploader'),
      (req: Request, res: Response<ItemApiResponse<Asset>>) => {
        // Logger.Info(`Uploading plan document: ${req.file.originalname}...`);
        // we use single because filepond send file by one
        const file = {
          title: req.file.originalname,
          location: req.file.destination.split('uploads')[1],
          type: req.file.mimetype
        };

        Plan.findByPk(req.params.planId, {
          attributes: ['id']
        })
          .then((plan) => {
            plan
              .createDocument(file)
              .then((doc) => {
                return res.status(StatusCodes.OK).json({ success: true, message: 'Doccument added!', data: doc });
              })
              .catch(() => {
                // Logger.Err(error);
                return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({ success: false, message: 'Sorry, something went wrong...', data: null });
              });
          })
          .catch((error: any) => {
            // Logger.Err(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
          });
      }
    );

    this.router.delete(
      '/documents',
      (req: RequestWithQuery<{ planId: string; docId: string }>, res: Response<BaseResponse>) => {
        // Logger.Info(`Deleting plan document by id: ${req.query.docId} where plan id: ${req.query.planId}...`);
        Plan.findByPk(req.query.planId, {
          attributes: ['id'],
          include: [
            {
              model: Asset as any,
              as: 'Documents',
              through: {
                where: { AssetId: req.query.docId },
                attributes: []
              }
            }
          ]
        })
          .then((plan) => {
            const docToDelete = plan.Documents[0];
            Asset.destroy({
              where: {
                id: docToDelete.id
              }
            })
              .then(() => {
                // REDO to file server
                let destination = path.join(__dirname, '../../uploads');
                destination = destination + docToDelete.location + '/' + docToDelete.title;
                this.unlinkAsync(destination)
                  .then(() => {
                    return res
                      .status(StatusCodes.OK)
                      .json({ success: true, message: 'Document deleted successfully!' });
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
    );

    this.router.delete('/:id', (req: Request, res: Response<BaseResponse>) => {
      // Logger.Info(`Deleting plan by id: ${req.params.id}...`);
      Plan.destroy({
        where: { id: req.params.id }
      })
        .then((result) => {
          return res.status(StatusCodes.OK).json({ success: true, message: `Deleted ${result} plan` });
        })
        .catch((error: any) => {
          // Logger.Err(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        });
    });

    return this.router;
  }

  private findPlanById(planId: number | string): Promise<Plan> {
    return Plan.findByPk(planId, {
      include: [
        {
          model: User as any,
          as: 'Creator',
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: Asset as any,
              as: 'avatar'
            }
          ]
        },
        {
          model: User as any,
          as: 'Participants',
          attributes: { exclude: ['passwordHash', 'salt'] },
          through: {
            attributes: []
          },
          include: [
            {
              model: Asset as any,
              as: 'avatar'
            }
          ]
        },
        {
          model: Asset as any,
          as: 'Documents',
          through: {
            attributes: []
          }
        },
        {
          model: Stage as any,
          as: 'activeStage'
        },
        {
          model: Stage as any,
          as: 'Stages',
          through: {
            as: 'Details',
            attributes: { exclude: ['PlanId', 'StageId'] }
          } as IncludeThroughOptions
        }
      ],
      order: [Sequelize.col('order')]
    });
  }
}
