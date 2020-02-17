import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Plan } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createPlan } from '../../store/plan.actions';
import { MediaqueryService } from '@/_shared/services';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit, OnDestroy {
  plan = new Plan();
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

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.plan.Participants = result;
      }
    });
  }

  onClickSubmit() {
    this.plan.CreatorId = this.appUser.id;
    this.store.dispatch(createPlan({ plan: { ...this.plan, ...this.planData.value } }));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
