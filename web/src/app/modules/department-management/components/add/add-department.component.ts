import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Department } from '@core/modules/department-api/shared';
import { createDepartmentRequested } from '@core/modules/department-api/store';
import { AppState } from '@core/store';

@Component({
  template: `
    <templates-department-view
      [editForm]="true"
      [canEdit]="true"
      [isCreatePage]="true"
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

  constructor(private store$: Store<AppState>) {}

  onSubmit(department: Department): void {
    this.store$.dispatch(createDepartmentRequested({ department }));
  }
}
