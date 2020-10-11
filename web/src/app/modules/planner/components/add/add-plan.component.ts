import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Plan } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { createPlanRequested } from '../../store/plan.actions';
import { MediaqueryService } from '@/shared/services';
import { ACTION_LABELS } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';

@Component({
  selector: 'add-plan',
  templateUrl: './add-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPlanComponent implements OnInit, OnDestroy {
  planFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('plan')));

  plan = {} as Plan;
  planFormValues: Plan;

  actionLabels = ACTION_LABELS;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store$: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'plan' }));

    this.plan.Participants = [];
  }

  planFormValueChanges(formVal: Plan): void {
    this.planFormValues = { ...this.planFormValues, ...formVal };
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select participants'
      }
    });

    const userC = dialogRef.componentInstance.usersComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
      .subscribe(() => {
        userC.users
          .filter((user) => this.plan.Participants.some((participant) => participant.id === user.id))
          ?.forEach((selectedParticipant) => {
            userC.selection.select(selectedParticipant);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedParticipants: User[] = result?.filter(
          (selectedParticipant) => !this.plan.Participants.some((user) => user.id === selectedParticipant.id)
        );

        if (selectedParticipants?.length) {
          this.plan.Participants = [...this.plan.Participants, ...selectedParticipants];
          this.cdr.detectChanges();
        }
      });
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
