import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { Department } from '../../models';
import { createDepartmentRequested } from '../../store/department.actions';
import { FORMCONSTANTS } from '@/shared/constants';

@Component({
  selector: 'add-department-component',
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
