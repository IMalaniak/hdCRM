import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { StagesDialogComponent } from '../../_components/stages/dialog/stages-dialog.component';
import { Plan, Stage, PlanStage } from '../../_models';
import { PlanService } from '../../_services';
import { UsersDialogComponent, User } from '@/_modules/users';
import { AppState } from '@/core/reducers';
import { PlanSaved } from '../../store/plan.actions';
import { isPrivileged, currentUser } from '@/core/auth/store/auth.selectors';
import { MediaqueryService } from '@/_shared/services';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  showDataLoader: boolean;
  appUser$: Observable<User>;
  plan: Plan;
  planInitial: Plan;
  editForm: boolean;
  configPlanStages: boolean;
  editPlanPrivilege$: Observable<boolean>;
  configStagesPrivilege$: Observable<boolean>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService
  ) {
    this.editForm = false;
    this.configPlanStages = false;
    this.showDataLoader = true;
  }

  ngOnInit() {
      this.appUser$ = this.store.pipe(select(currentUser));
      this.editPlanPrivilege$ = this.store.pipe(select(isPrivileged('editPlan')));
      this.configStagesPrivilege$ = this.store.pipe(select(isPrivileged('configStages')));

      this.plan = new Plan(this.route.snapshot.data['plan']);
      this.planInitial = new Plan(this.route.snapshot.data['plan']);
      this.canEditPlan$.pipe(takeUntil(this.unsubscribe)).subscribe(canEdit => {
        if (canEdit) {
          const edit = this.route.snapshot.queryParams['edit'];
          if (edit) {
            this.editForm = JSON.parse(edit);
          }
        }
      });
  }

  get canEditPlan$(): Observable<boolean> {
    // combine 3 observables and compare values => return boolean
    const combine = combineLatest([this.editPlanPrivilege$, this.configStagesPrivilege$, this.appUser$]);
    return combine.pipe(
      map(res => ((res[0] && res[1]) || res[2].id === this.plan.CreatorId))
    );
  }

  goToNextStage(): void {
    // TODO ngrx
    this.planService.toNextStage(this.plan.id).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        const plan: Update<Plan> = {
          id: this.plan.id,
          changes: data
        }
        this.store.dispatch(new PlanSaved({plan}));
        this.plan = new Plan(data);
        this.planInitial = new Plan(data);
        this.configPlanStages = false;
        Swal.fire({
          text: 'Stages updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
      }
    );
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickConfigureStages(): void {
    this.configPlanStages = true;
  }

  onClickCancelEditStages(): void {
    this.configPlanStages = false;
    this.plan = this.planInitial;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.plan = this.planInitial;
  }

  updatePlanStages(): void {
    this.planService.updatePlanStages(this.plan).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        const plan: Update<Plan> = {
          id: this.plan.id,
          changes: data
        };
        this.store.dispatch(new PlanSaved({plan}));
        this.plan = new Plan(data);
        this.planInitial = new Plan(data);
        this.configPlanStages = false;
        Swal.fire({
          text: 'Stages updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
      }
    );
  }

  updatePlan(): void {
    // Update plan
    this.planService.updateOne(this.plan).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        const plan: Update<Plan> = {
          id: this.plan.id,
          changes: data
        };
        this.store.dispatch(new PlanSaved({plan}));
        this.plan = new Plan(data);
        this.planInitial = new Plan(data);
        this.editForm = false;
        Swal.fire({
          text: 'Plan updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
      }
    );
  }

  addStageDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(StagesDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select stages',
      }
    });

    const stagesC = dialogRef.componentInstance.stagesComponent;

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      stagesC.isLoading$.pipe(takeUntil(this.unsubscribe)).subscribe(isLoading => {
        if (!isLoading) {
          for (const pStage of this.plan.Stages) {
            stagesC.stages.find((stage, i) => {
                if (stage.id === pStage.id) {
                  stagesC.selection.select(stage);
                  return true; // stop searching
                }
            });
          }
        }
      });
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe((result: Stage[]) => {
      // remove unchecked
      const removeUnchecked = new Promise((resolve, reject) => {
        const pStages = this.plan.Stages;
        pStages.forEach((stage, i) => {
          const tmp = result.filter(el => {
            return stage.id === el.id;
          });
          if (tmp.length === 0) {
            this.plan.Stages.splice(i, 1);
          }
          if (i === this.plan.Stages.length - 1) {
            resolve();
          }
        });
      });

      removeUnchecked.then(res => {
        // add checked if no such
        result.forEach((el, i) => {
          const tmp = this.plan.Stages.filter(stage => {
            return stage.id === el.id;
          });
          if (tmp.length === 0) {
            const newStage = new Stage(el);
            newStage.Details = new PlanStage({
              order: i,
              completed: false,
              description: ''
            });
            this.plan.Stages.push(newStage);
          }
        });
      });

    });
  }

  dragDropStages(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.plan.Stages, event.previousIndex, event.currentIndex);
    this.plan.Stages = this.plan.Stages.map((stage, i) => {
      const newStage = new Stage(stage);
      newStage.Details.order = i;
      return newStage;
    });
  }

  addParticipantDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select participants',
      }
    });

    const usersC = dialogRef.componentInstance.usersComponent;

    // TODO
    // dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
    //   usersC.isLoading$.pipe(takeUntil(this.unsubscribe)).subscribe(isLoading => {
    //     if (!isLoading) {
    //       for (const pParticipant of this.plan.Participants) {
    //         usersC.users.find((user, i) => {
    //             if (user.id === pParticipant.id) {
    //               usersC.selection.select(user);
    //               return true; // stop searching
    //             }
    //         });
    //       }
    //     }
    //   });
    // });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result) {
        this.plan.Participants = result;
      }
    });
  }

  deleteDoc(docId: number): void {
    // Swal.fire({
    //   title: 'You are going to delete document',
    //   text: 'Are you sure you want to delete document from plan, changes cannot be undone?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Confirm',
    //   cancelButtonText: 'Cancel'
    // }).then((result) => {
    //   if (result.value) {
    //     const req = {
    //       planId: this.plan.id,
    //       docId: docId
    //     };
    //     this.planService.deleteDoc(req).pipe(takeUntil(this.unsubscribe)).subscribe(plan => {
    //       if (plan) {

    //         Swal.fire({
    //           text: 'You have successfully removed a document from plan',
    //           type: 'success',
    //           timer: 6000,
    //           toast: true,
    //           showConfirmButton: false,
    //           position: 'bottom-end'
    //         });
    //       } else {
    //         Swal.fire({
    //           text: 'Ooops, something went wrong!',
    //           type: 'error',
    //         });
    //       }
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
