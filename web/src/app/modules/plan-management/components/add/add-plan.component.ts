import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/store';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { Plan } from '@/core/modules/plan-api/shared';
import { createPlanRequested } from '@/core/modules/plan-api/store/plan';
import { ADD_PRIVILEGE, DELETE_PRIVILEGE } from '@/shared/constants';

@Component({
  template: `
    <templates-plan-view
      [item]="plan"
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
  canAddAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.PLAN_ATTACHMENT)));
  // TODO: @IMalaniak use this for stages configurations
  // configStages$: Observable<boolean> = this.store.pipe(select(isPrivileged('stage-edit')));
  canDeleteAttachment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.PLAN_ATTACHMENT)));

  plan = { Participants: [] } as Plan;

  constructor(private readonly store$: Store<AppState>) {}

  onSubmit(plan: Plan): void {
    this.store$.dispatch(createPlanRequested({ plan }));
  }
}
