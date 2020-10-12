import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { MediaqueryService } from '@/shared/services';
import { DynamicForm } from '@/shared/models';
import { ACTION_LABELS, RoutingDataConstants } from '@/shared/constants';
import { UsersDialogComponent, User } from '@/modules/users';
import { Plan } from '../../models';
import { createPlanRequested } from '../../store/plan.actions';

@Component({
  selector: 'add-plan',
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
    private dialog: MatDialog,
    private store$: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.planFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
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
