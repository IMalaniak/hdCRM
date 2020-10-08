import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Plan } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { createPlanRequested } from '../../store/plan.actions';
import { ACTION_LABELS, CONSTANTS } from '@/shared/constants';
import { DialogService } from '@/core/services/dialog/dialog.service';
import { DialogWithTwoButtonModel } from '@/shared/models/modal/dialog-with-two-button.model';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { ModalDialogResult } from '@/shared/models/modal/modal-dialog-result.model';

@Component({
  templateUrl: './add-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPlanComponent implements OnInit, OnDestroy {
  plan = {} as Plan;
  planData: FormGroup;
  appUser: User;

  actionLabels = ACTION_LABELS;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.store$.pipe(select(currentUser), takeUntil(this.unsubscribe)).subscribe((user) => {
      this.appUser = user;
    });

    this.buildPlanForm();
    this.plan.Participants = [];
  }

  buildPlanForm(): void {
    this.planData = this.fb.group({
      title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      budget: new FormControl(null, [Validators.required, Validators.min(0)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(2500)]),
      deadline: new FormControl(null, Validators.required)
    });
  }

  addParticipantDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PARTICIPANS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<User[]>) => {
        if (result && result.result) {
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
    // TODO: @IMalaniak create logic on BE side to set CreatorId, after this delete CreatorId prop below
    this.plan = { ...this.plan, CreatorId: this.appUser.id };
    this.store$.dispatch(createPlanRequested({ plan: { ...this.plan, ...this.planData.value } }));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
