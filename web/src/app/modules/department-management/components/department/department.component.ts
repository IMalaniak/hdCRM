import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { currentUser, isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import {
  departmentRequested,
  selectDepartmentDeepById,
  updateDepartmentRequested
} from '@/core/modules/department-api/store';
import { Department } from '@/core/modules/department-api/shared';
import { EDIT_PRIVILEGE } from '@/shared/constants';
import { changeIsEditingState, cacheDepartment, selectIsEditing, restoreFromCache } from '../../store';

@Component({
  template: `
    <templates-department-view
      [editForm]="editForm$ | async"
      [item]="department$ | async"
      [canEdit]="canEditDepartment$ | async"
      (saveChanges)="updateDepartment($event)"
      (isEditing)="onFormStateChange($event)"
    ></templates-department-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  department$: Observable<Department>;
  canEditDepartment$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {}

  ngOnInit(): void {
    const id: number = this.route.snapshot.params['id'];

    this.department$ = this.store$.pipe(
      select(selectDepartmentDeepById(id)),
      tap((department) => {
        if (!department) {
          this.store$.dispatch(departmentRequested({ id }));
        } else {
          this.store$.dispatch(cacheDepartment({ id }));
        }
      }),
      filter((department) => !!department)
    );

    this.canEditDepartment$ = combineLatest([
      this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.DEPARTMENT))),
      this.store$.pipe(select(currentUser)),
      this.department$
    ]).pipe(map(([editPriv, appUser, department]) => editPriv || appUser.id === department.managerId));
  }

  onFormStateChange(isEditing: boolean): void {
    if (!isEditing) {
      this.store$.dispatch(restoreFromCache());
    }
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  updateDepartment(department: Department): void {
    this.store$.dispatch(updateDepartmentRequested({ department }));
  }
}
