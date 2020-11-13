import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { EDIT_PRIVILEGES, FORMCONSTANTS } from '@/shared/constants';
import { updateRoleRequested, changeIsEditingState, roleRequested } from '../../store/role.actions';
import { selectIsEditing, selectRoleDeepById } from '../../store/role.selectors';
import { Role } from '../../models';

@Component({
  selector: 'role',
  template: `
    <templates-role-view
      [item]="role$ | async"
      [editForm]="editForm$ | async"
      [formName]="formName"
      [canEdit]="canEditRole$ | async"
      (isEditing)="onFormStateChange($event)"
      (saveChanges)="updateRole($event)"
    ></templates-role-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.ROLE)));
  role$: Observable<Role>;

  formName = FORMCONSTANTS.ROLE;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.role$ = this.store$.pipe(
      select(selectRoleDeepById(id)),
      tap((role) => {
        if (!role) {
          this.store$.dispatch(roleRequested({ id }));
        }
      }),
      filter((role) => !!role)
    );
  }

  onFormStateChange(isEditing: boolean): void {
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  updateRole(role: Role): void {
    this.store$.dispatch(updateRoleRequested({ role }));
  }
}
