import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { Department } from '../../models';
import { createDepartmentRequested } from '../../store/department.actions';

@Component({
  selector: 'add-department-component',
  template: `
    <templates-department-view
      [editForm]="true"
      [isCreatePage]="true"
      [department]="department"
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

  constructor(private store: Store<AppState>) {}

  onSubmit(department: Department) {
    this.store.dispatch(createDepartmentRequested({ department }));
  }
}
