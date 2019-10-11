import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as roleActions from './role.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { RoleService, PrivilegeService } from '../_services';
import { AppState } from '@/core/reducers';
import { RoleServerResponse, Privilege } from '../_models';
import Swal from 'sweetalert2';
import { allPrivilegesLoaded } from './role.selectors';

@Injectable()
export class RoleEffects {

    @Effect()
    loadRole$: Observable<Action> = this.actions$.pipe(
        ofType<roleActions.RoleRequested>(roleActions.RoleActionTypes.ROLE_REQUESTED),
        mergeMap(action => this.roleService.getRole(action.payload.roleId)),
        map(role => new roleActions.RoleLoaded({role}))
    );

    @Effect()
    loadRoles$ = this.actions$.pipe(
        ofType<roleActions.RolesListPageRequested>(roleActions.RoleActionTypes.ROLES_LIST_PAGE_REQUESTED),
        mergeMap(({payload}) =>
                this.roleService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      console.log('error loading a roles page ', err);
                      this.store.dispatch(new roleActions.RolesListPageCancelled());
                      return of(new RoleServerResponse());
                    })
                  )
        ),
        map((response: RoleServerResponse) => new roleActions.RolesListPageLoaded(response)),
    );

    @Effect()
    loadAllPrivilege$ = this.actions$.pipe(
        ofType<roleActions.AllPrivilegesRequested>(roleActions.RoleActionTypes.ALLPRIVILEGES_REQUESTED),
        withLatestFrom(this.store.pipe(select(allPrivilegesLoaded))),
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
            return new roleActions.CreatePrivilegeSuccess({privilege: newPrivilege});
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

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private roleService: RoleService,
        private privilegeService: PrivilegeService
    ) {}
}
