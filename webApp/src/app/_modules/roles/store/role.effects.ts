import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as roleActions from './role.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { RoleService, PrivilegeService } from '../_services';
import { AppState } from '@/core/reducers';
import { RoleServerResponse, Privilege, Role } from '../_models';
import Swal from 'sweetalert2';
import { allPrivilegesLoaded, selectRolesDashboardDataLoaded } from './role.selectors';
import { Router } from '@angular/router';

@Injectable()
export class RoleEffects {
  @Effect()
  createRole$: Observable<Action> = this.actions$.pipe(
    ofType<roleActions.CreateRole>(roleActions.RoleActionTypes.ROLE_CREATE),
    map((action: roleActions.CreateRole) => action.payload.role),
    mergeMap((role: Role) =>
      this.roleService.create({ ...role }).pipe(
        map(newRole => {
          Swal.fire({
            title: 'Role created!',
            type: 'success',
            timer: 1500
          });
          this.router.navigate(['/roles']);
          return new roleActions.CreateRoleSuccess({ role: newRole });
        }),
        catchError(err => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            type: 'error',
            timer: 1500
          });
          return of(new roleActions.CreateRoleFail(err));
        })
      )
    )
  );

  @Effect()
  loadRole$: Observable<Action> = this.actions$.pipe(
    ofType<roleActions.RoleRequested>(roleActions.RoleActionTypes.ROLE_REQUESTED),
    mergeMap(action => this.roleService.getRole(action.payload.roleId)),
    map(role => new roleActions.RoleLoaded({ role }))
  );

  @Effect()
  loadRoles$ = this.actions$.pipe(
    ofType<roleActions.RolesListPageRequested>(roleActions.RoleActionTypes.ROLES_LIST_PAGE_REQUESTED),
    mergeMap(({ payload }) =>
      this.roleService
        .getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
        .pipe(
          catchError(err => {
            console.log('error loading a roles page ', err);
            this.store.dispatch(new roleActions.RolesListPageCancelled());
            return of(new RoleServerResponse());
          })
        )
    ),
    map((response: RoleServerResponse) => new roleActions.RolesListPageLoaded(response))
  );

  @Effect({ dispatch: false })
  deleteRole$ = this.actions$.pipe(
    ofType<roleActions.DeleteRole>(roleActions.RoleActionTypes.DELETE_ROLE),
    mergeMap(action => this.roleService.delete(action.payload.roleId)),
    map(() => {
      Swal.fire({
        text: `Role deleted`,
        type: 'success',
        timer: 6000,
        toast: true,
        showConfirmButton: false,
        position: 'bottom-end'
      });
    })
  );

  @Effect()
  loadAllPrivilege$ = this.actions$.pipe(
    ofType<roleActions.AllPrivilegesRequested>(roleActions.RoleActionTypes.ALLPRIVILEGES_REQUESTED),
    withLatestFrom(this.store.pipe(select(allPrivilegesLoaded))),
    tap(([action, allPrivilegesLoaded]) => {
      if (allPrivilegesLoaded) {
        this.store.dispatch(new roleActions.AllPrivilegesRequestCanceled());
      }
    }),
    filter(([action, allPrivilegesLoaded]) => !allPrivilegesLoaded),
    mergeMap(() => this.privilegeService.getFullList()),
    map(privileges => new roleActions.AllPrivilegesLoaded(privileges)),
    catchError(err => throwError(err))
  );

  @Effect()
  createPrivilege$: Observable<Action> = this.actions$.pipe(
    ofType<roleActions.CreatePrivilege>(roleActions.RoleActionTypes.PRIVILEGE_CREATE),
    map((action: roleActions.CreatePrivilege) => action.payload.privilege),
    mergeMap((privilege: Privilege) =>
      this.privilegeService.create(privilege).pipe(
        map(newPrivilege => {
          Swal.fire({
            title: 'Privilege created!',
            type: 'success',
            timer: 1500
          });
          return new roleActions.CreatePrivilegeSuccess({
            privilege: newPrivilege
          });
        }),
        catchError(err => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            type: 'error',
            timer: 1500
          });
          return of(new roleActions.CreatePrivilegeFail(err));
        })
      )
    )
  );

  @Effect()
  loadDashboardData$ = this.actions$.pipe(
    ofType<roleActions.RoleDashboardDataRequested>(roleActions.RoleActionTypes.ROLE_DASHBOARD_DATA_REQUESTED),
    withLatestFrom(this.store.pipe(select(selectRolesDashboardDataLoaded))),
    filter(([action, rolesDashboardDataLoaded]) => !rolesDashboardDataLoaded),
    mergeMap(() => this.roleService.getDashboardData()),
    map(resp => new roleActions.RoleDashboardDataLoaded(resp)),
    catchError(err => {
      console.log('error loading dep data for dashboard ', err);
      return throwError(err);
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private roleService: RoleService,
    private privilegeService: PrivilegeService
  ) {}
}
