import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as roleActions from './role.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { RoleService } from '../_services';
import { AppState } from '@/core/reducers';
import { RoleServerResponse } from '../_models';

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

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private roleService: RoleService,
    ) {}
}
