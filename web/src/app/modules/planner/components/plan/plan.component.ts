import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Plan } from '../../models';
import { PlanService } from '../../services';
import { UsersDialogComponent, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { updatePlanRequested, changeIsEditingState } from '../../store/plan.actions';
import { isPrivileged, currentUser } from '@/core/auth/store/auth.selectors';
import { ToastMessageService } from '@/shared/services';
import {
  Asset,
  ServiceMessage,
  DynamicForm,
  DialogDataModel,
  DialogWithTwoButtonModel
} from '@/shared/models';
import {
  ADD_PRIVILEGES,
  DELETE_PRIVILEGES,
  EDIT_PRIVILEGES,
  ACTION_LABELS,
  THEME_PALETTE,
  CONSTANTS
} from '@/shared/constants';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { selectIsEditing } from '../../store/plan.selectors';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/core/services/dialog';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';

@Component({
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanComponent implements OnInit, OnDestroy {
  canEditPlan$: Observable<boolean> = combineLatest([
    this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.PLAN))),
    this.store$.pipe(select(currentUser))
  ]).pipe(map(([editPriv, appUser]) => editPriv || appUser.id === this.plan.CreatorId));
  canAddAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.PLAN_ATTACHMENT)));
  // configStages$: Observable<boolean> = this.store.pipe(select(isPrivileged('stage-edit')));
  canDeleteAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.PLAN_ATTACHMENT)));
  planFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('plan')));
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));

  plan: Plan;
  planInitial: Plan;
  planFormValues: Plan;
  configPlanStages = false;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private toastMessageService: ToastMessageService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'plan' }));
    this.plan = cloneDeep(this.route.snapshot.data['plan']);
    this.planInitial = cloneDeep(this.route.snapshot.data['plan']);
  }

  planFormValueChanges(formVal: User): void {
    this.planFormValues = { ...this.planFormValues, ...formVal };
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

  onClickEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: true }));
  }

  // onClickConfigureStages(): void {
  //   this.configPlanStages = true;
  // }

  // onClickCancelEditStages(): void {
  //   this.configPlanStages = false;
  //   this.plan = cloneDeep(this.planInitial);
  // }

  onClickCancelEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: false }));
    this.plan = cloneDeep(this.planInitial);
  }

  removeParticipant(userId: number): void {
    this.plan = {
      ...this.plan,
      Participants: this.plan.Participants.filter((participant) => participant.id !== userId)
    };
  }

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

  updatePlan(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_PLAN_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => this.store$.dispatch(updatePlanRequested({ plan: this.plan })));
  }

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

  addParticipantDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PARTICIPANS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
          const selectedParticipants: User[] = result.model.filter(
            (selectedParticipant) => !this.plan.Participants.some((user) => user.id === selectedParticipant.id)
          );
          if (selectedParticipants.length) {
            this.plan.Participants = [...this.plan.Participants, ...selectedParticipants];
            this.cdr.detectChanges();
          }
        }
      });

    // const userC = dialogRef.componentInstance.usersComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
    //   .subscribe(() => {
    //     userC.users
    //       .filter((user) => this.plan.Participants.some((participant) => participant.id === user.id))
    //       ?.forEach((selectedParticipant) => {
    //         userC.selection.select(selectedParticipant);
    //       });
    //   });
  }

  addDocument(doc: Asset): void {
    this.plan = { ...this.plan, Documents: [...this.plan.Documents, doc] };
    this.store$.dispatch(updatePlanRequested({ plan: this.plan }));
  }

  deleteDoc(docId: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_PLAN_DOCUMENT);
    const dialogDataModel = new DialogDataModel(dialogModel);
    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => {
        const req = {
          planId: this.plan.id,
          docId: docId
        };
        this.planService
          .deleteDoc(req)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response: ServiceMessage) => {
            if (response.success) {
              this.plan = { ...this.plan, Documents: this.plan.Documents.filter((doc) => doc.id !== docId) };
              this.store$.dispatch(updatePlanRequested({ plan: this.plan }));
              this.cdr.detectChanges();
              this.toastMessageService.snack(response);
            } else {
              this.toastMessageService.snack(response);
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
