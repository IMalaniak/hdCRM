import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { createDepartmentRequested } from '@/core/modules/department-api/store';
import { FORMCONSTANTS } from '@/shared/constants';
import { Department } from '../../models';

@Component({
  template: `
    <templates-department-view
      [editForm]="true"
      [canEdit]="true"
      [isCreatePage]="true"
      [formName]="formName"
      [item]="department"
      (saveChanges)="onSubmit($event)"
    ></templates-department-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDepartmentComponent {
  department: Department = {
    SubDepartments: [],
    Workers: []
  } as Department;

  formName = FORMCONSTANTS.DEPARTMENT;

  constructor(private store$: Store<AppState>) {}

  onSubmit(department: Department): void {
    this.store$.dispatch(createDepartmentRequested({ department }));
  }
}
