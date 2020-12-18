import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { currentUser, isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { EDIT_PRIVILEGES, FORMCONSTANTS } from '@/shared/constants';
import { Department } from '../../models';
import { updateDepartmentRequested, changeIsEditingState, departmentRequested } from '../../store/department.actions';
import { selectDepartmentDeepById, selectIsEditing } from '../../store/department.selectors';

@Component({
  template: `
    <templates-department-view
      [editForm]="editForm$ | async"
      [formName]="formName"
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

  formName = FORMCONSTANTS.DEPARTMENT;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {}

  ngOnInit(): void {
    const id: number = this.route.snapshot.params['id'];

    this.department$ = this.store$.pipe(
      select(selectDepartmentDeepById(id)),
      tap((department) => {
        if (!department) {
          this.store$.dispatch(departmentRequested({ id }));
        }
      }),
      filter((department) => !!department)
    );

    this.canEditDepartment$ = combineLatest([
      this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.DEPARTMENT))),
      this.store$.pipe(select(currentUser)),
      this.department$
    ]).pipe(map(([editPriv, appUser, department]) => editPriv || appUser.id === department.managerId));
  }

  onFormStateChange(isEditing: boolean): void {
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  updateDepartment(department: Department): void {
    this.store$.dispatch(updateDepartmentRequested({ department }));
  }
}
