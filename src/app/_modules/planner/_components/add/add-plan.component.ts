import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material';
import { Plan } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CreatePlan } from '../../store/plan.actions';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit, OnDestroy {
  plan = new Plan();
  baseUrl: string;
  appUser: User;

  private unsubscribe: Subject<void> = new Subject();


  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.baseUrl = environment.baseUrl;
   }

  ngOnInit() {
    this.store.pipe(select(currentUser), takeUntil(this.unsubscribe)).subscribe(user => {
      this.appUser = user;
    });
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      height: '80vh',
      width: '80vw',
      data: {
        title: 'Select participants',
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
    this.store.dispatch(new CreatePlan({plan: this.plan}));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
