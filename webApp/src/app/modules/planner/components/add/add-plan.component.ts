import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Plan } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createPlan } from '../../store/plan.actions';
import { MediaqueryService } from '@/shared';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html'
})
export class AddPlanComponent implements OnInit, OnDestroy {
  plan = {} as Plan;
  planData: FormGroup;
  appUser: User;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.planData = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      budget: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(2500)]),
      deadline: new FormControl('', Validators.required)
    });

    this.store.pipe(select(currentUser), takeUntil(this.unsubscribe)).subscribe(user => {
      this.appUser = user;
    });

    this.plan.Participants = [];
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
          .filter(user => this.plan.Participants.some(participant => participant.id === user.id))
          ?.forEach(selectedParticipant => {
            userC.selection.select(selectedParticipant);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedParticipants: User[] = result?.filter(
          selectedParticipant => !this.plan.Participants.some(user => user.id === selectedParticipant.id)
        );

        if (selectedParticipants?.length) {
          this.plan.Participants = [...this.plan.Participants, ...selectedParticipants];
        }
      });
  }

  onClickSubmit() {
    this.plan.CreatorId = this.appUser.id;
    this.store.dispatch(createPlan({ plan: { ...this.plan, ...this.planData.value } }));
  }

  removeParticipant(id: number) {
    // TODO: @ArseniiIrod, @IMalaniak add logic to remove participant
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
