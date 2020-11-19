import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { ADD_PRIVILEGES, DELETE_PRIVILEGES, FORMCONSTANTS } from '@/shared/constants';
import { Plan } from '../../models';
import { createPlanRequested } from '../../store/plan.actions';
import { isPrivileged } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'add-plan',
  template: `
    <templates-plan-view
      [item]="plan"
      [formName]="formName"
      [editForm]="true"
      [canEdit]="true"
      [isCreatePage]="true"
      [canAddAttachment]="canAddAttachment$ | async"
      [canDeleteAttachment]="canDeleteAttachment$ | async"
      (saveChanges)="onSubmit($event)"
    ></templates-plan-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPlanComponent {
  canAddAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.PLAN_ATTACHMENT)));
  // TODO: @IMalaniak use this for stages configurations
  // configStages$: Observable<boolean> = this.store.pipe(select(isPrivileged('stage-edit')));
  canDeleteAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.PLAN_ATTACHMENT)));

  plan = { Participants: [] } as Plan;

  formName = FORMCONSTANTS.PLAN;

  constructor(private store$: Store<AppState>) {}

  onSubmit(plan: Plan): void {
    this.store$.dispatch(createPlanRequested({ plan }));
  }
}
