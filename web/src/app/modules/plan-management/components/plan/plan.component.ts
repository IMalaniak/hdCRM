import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { isPrivileged, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { Plan } from '@/core/modules/plan-api/shared';
import { selectPlanDeepById, planRequested, updatePlanRequested } from '@/core/modules/plan-api/store/plan';
import { ADD_PRIVILEGE, DELETE_PRIVILEGE, EDIT_PRIVILEGE } from '@/shared/constants';
import { selectIsEditing, changeIsEditingState, cachePlan, restoreFromCache } from '../../store';

@Component({
  template: `
    <templates-plan-view
      [item]="plan$ | async"
      [editForm]="editForm$ | async"
      [canEdit]="canEditPlan$ | async"
      [canAddAttachment]="canAddAttachment$ | async"
      [canDeleteAttachment]="canDeleteAttachment$ | async"
      (isEditing)="onFormStateChange($event)"
      (saveChanges)="updatePlan($event)"
    ></templates-plan-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanComponent implements OnInit {
  canEditPlan$: Observable<boolean>;
  canAddAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.PLAN_ATTACHMENT)));
  // TODO: @IMalaniak use this when implementing configure stages
  // configStages$: Observable<boolean> = this.store.pipe(select(isPrivileged('stage-edit')));
  canDeleteAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.PLAN_ATTACHMENT)));
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));

  plan$: Observable<Plan>;
  // configPlanStages = false;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {}

  ngOnInit(): void {
    const id: number = this.route.snapshot.params['id'];

    this.plan$ = this.store$.pipe(
      select(selectPlanDeepById(id)),
      tap((plan) => {
        if (!plan) {
          this.store$.dispatch(planRequested({ id }));
        } else {
          this.store$.dispatch(cachePlan({ id }));
        }
      }),
      filter((plan) => !!plan)
    );

    this.canEditPlan$ = combineLatest([
      this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.PLAN))),
      this.store$.pipe(select(currentUser)),
      this.plan$
    ]).pipe(map(([editPriv, appUser, plan]) => editPriv || appUser.id === plan.CreatorId));
  }

  onFormStateChange(isEditing: boolean): void {
    if (!isEditing) {
      this.store$.dispatch(restoreFromCache());
    }
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  updatePlan(plan: Plan): void {
    this.store$.dispatch(updatePlanRequested({ plan }));
  }

  // TODO: @IMalaniak recreate store logic
  // goToNextStage(): void {
  //   this.toastMessageService
  //     .confirm(DIALOG.CONFIRM, 'Are you sure you want to go to next plan stage?')
  //     .then((result) => {
  //       if (result.value) {
  //         this.planService
  //           .toNextStage(this.plan.id)
  //           .pipe(takeUntil(this.unsubscribe))
  //           .subscribe(
  //             ({ data }) => {
  //               this.updatePlanStore(data);
  //               this.configPlanStages = false;
  //               this.toastMessageService.toast('Stages updated!');
  //             },
  //             () => {
  //               this.toastMessageService.popup('Ooops, something went wrong!', 'error');
  //             }
  //           );
  //       }
  //     });
  // }

  // onClickConfigureStages(): void {
  //   this.configPlanStages = true;
  // }

  // onClickCancelEditStages(): void {
  //   this.configPlanStages = false;
  //   this.plan = cloneDeep(this.planInitial);
  // }

  // updatePlanStages(): void {
  //   this.toastMessageService
  //     .confirm(DIALOG.CONFIRM, 'Are you sure you want update stages configuration?')
  //     .then((result) => {
  //       if (result.value) {
  //         this.store$.dispatch(updatePlanRequested({ plan: this.plan }));
  //         this.configPlanStages = false;
  //       }
  //     });
  // }

  // TODO: @ArseniiIrod, @IMalaniak remake logic
  // addStageDialog(): void {
  //   const dialogRef = this.dialog.open(StagesDialogComponent, {
  //     ...this.mediaQueryService.deFaultPopupSize,
  //     data: {
  //       title: 'Select stages'
  //     }
  //   });

  //   const stagesC = dialogRef.componentInstance.stagesComponent;

  //   dialogRef
  //     .afterOpened()
  //     .pipe(takeUntil(this.unsubscribe), skipUntil(stagesC.isLoading$), delay(300))
  //     .subscribe(() => {
  //       stagesC.stages
  //         .filter(user => this.plan.Participants.some(participant => participant.id === user.id))
  //         ?.forEach(selectedParticipant => {
  //           stagesC.selection.select(selectedParticipant);
  //         });
  //     });

  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe((result: Stage[]) => {
  //       // remove unchecked
  //       const removeUnchecked = new Promise((resolve, reject) => {
  //         const pStages = this.plan.Stages;
  //         pStages.forEach((stage, i) => {
  //           const tmp = result.filter(el => {
  //             return stage.id === el.id;
  //           });
  //           if (tmp.length === 0) {
  //             this.plan.Stages.splice(i, 1);
  //           }
  //           if (i === this.plan.Stages.length - 1) {
  //             resolve();
  //           }
  //         });
  //       });

  //       removeUnchecked.then(res => {
  //         // add checked if no such
  //         result.forEach((el: Stage, i) => {
  //           const tmp = this.plan.Stages.filter(stage => {
  //             return stage.id === el.id;
  //           });
  //           if (tmp.length === 0) {
  //             const newStage = el;
  //             newStage.Details = {
  //               order: i,
  //               completed: false,
  //               description: ''
  //             } as PlanStage;
  //             this.plan.Stages.push(newStage);
  //           }
  //         });
  //       });
  //     });
  // }

  // dragDropStages(event: CdkDragDrop<string[]>): void {
  //   moveItemInArray(this.plan.Stages, event.previousIndex, event.currentIndex);
  //   this.plan.Stages = this.plan.Stages.map((stage, i) => {
  //     stage.Details.order = i;
  //     return stage;
  //   });
  // }
}
