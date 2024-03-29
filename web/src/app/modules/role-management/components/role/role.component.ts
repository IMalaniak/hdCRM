import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { Role } from '@core/modules/role-api/shared';
import { selectRoleDeepById, roleRequested, updateRoleRequested } from '@core/modules/role-api/store/role';
import { AppState } from '@core/store';
import { EDIT_PRIVILEGE } from '@shared/constants';

import { cacheRole, changeIsEditingState, restoreFromCache, selectIsEditing } from '../../store';

@Component({
  template: `
    <templates-role-view
      [item]="role$ | async"
      [editForm]="editForm$ | async"
      [canEdit]="canEditRole$ | async"
      (isEditing)="onFormStateChange($event)"
      (saveChanges)="updateRole($event)"
    ></templates-role-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.ROLE)));
  role$: Observable<Role>;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {}

  ngOnInit(): void {
    const id: number = this.route.snapshot.params['id'];

    this.role$ = this.store$.pipe(
      select(selectRoleDeepById(id)),
      tap((role) => {
        if (!role) {
          this.store$.dispatch(roleRequested({ id }));
        } else {
          this.store$.dispatch(cacheRole({ id }));
        }
      }),
      filter((role) => !!role)
    );
  }

  onFormStateChange(isEditing: boolean): void {
    if (!isEditing) {
      this.store$.dispatch(restoreFromCache());
    }
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  updateRole(role: Role): void {
    this.store$.dispatch(updateRoleRequested({ role }));
  }
}
