import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { DynamicForm } from '@/shared/models';
import { FORMCONSTANTS } from '@/shared/constants';
import { Role } from '../../models';
import { createRoleRequested } from '../../store/role.actions';

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
