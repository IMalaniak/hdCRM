import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { Role } from '@/core/modules/role-api/shared';
import { createRoleRequested } from '@/core/modules/role-api/store/role';
import { DynamicForm } from '@/shared/models';
import { FORMCONSTANTS } from '@/shared/constants';

@Component({
  template: `
    <templates-role-view
      [item]="role"
      [editForm]="true"
      [canEdit]="true"
      [formName]="formName"
      [isCreatePage]="true"
      (saveChanges)="onRegisterSubmit($event)"
    ></templates-role-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRoleComponent {
  role = {
    Privileges: [],
    Users: []
  } as Role;
  roleFormJson: DynamicForm;
  roleFormValues: Role;

  formName = FORMCONSTANTS.ROLE;

  constructor(private store$: Store<AppState>) {}

  onRegisterSubmit(role: Role): void {
    this.store$.dispatch(createRoleRequested({ role }));
  }
}
