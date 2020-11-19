import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { DialogType, DynamicForm } from '@/shared/models';
import { ACTION_LABELS, RoutingDataConstants, CONSTANTS } from '@/shared/constants';
import { UsersDialogComponent, User } from '@/modules/users';
import { Plan } from '../../models';
import { createPlanRequested } from '../../store/plan.actions';
import { DialogService } from '@/shared/services';
import { DialogWithTwoButtonModel } from '@/shared/models/dialog/dialog-with-two-button.model';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogResultModel } from '@/shared/models/dialog/dialog-result.model';

@Component({
  templateUrl: './add-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPlanComponent implements OnInit, OnDestroy {
  plan = {} as Plan;
  planFormJson: DynamicForm;
  planFormValues: Plan;

  actionLabels = ACTION_LABELS;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.planFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
    this.plan.Participants = [];
  }

  planFormValueChanges(formVal: Plan): void {
    this.planFormValues = { ...this.planFormValues, ...formVal };
  }

  addParticipantDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PARTICIPANS)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          const selectedParticipants: User[] = result.model.filter(
            (selectedParticipant) => !this.plan.Participants.some((user) => user.id === selectedParticipant.id)
          );
          if (selectedParticipants?.length) {
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

  removeParticipant(userId: number): void {
    this.plan = {
      ...this.plan,
      Participants: this.plan.Participants.filter((participant) => participant.id !== userId)
    };
  }

  onClickSubmit(): void {
    this.store$.dispatch(createPlanRequested({ plan: { ...this.plan, ...this.planFormValues } }));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
