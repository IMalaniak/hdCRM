import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RoleRequested, RoleActionTypes, RoleLoaded, RolesListPageRequested, RolesListPageLoaded, RolesListPageCancelled } from './role.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { RoleService } from '../_services';
import { AppState } from '@/core/reducers';
import { RoleServerResponse } from '../_models';

@Injectable()
export class RoleEffects {

    @Effect()
    loadRole$: Observable<Action> = this.actions$.pipe(
        ofType<RoleRequested>(RoleActionTypes.RoleRequested),
        mergeMap(action => this.roleService.getRole(action.payload.roleId)),
        map(role => new RoleLoaded({role}))
    );

    @Effect()
    loadRoles$ = this.actions$.pipe(
        ofType<RolesListPageRequested>(RoleActionTypes.RolesListPageRequested),
        mergeMap(({payload}) =>
                this.roleService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      console.log('error loading a roles page ', err);
                      this.store.dispatch(new RolesListPageCancelled());
                      return of(new RoleServerResponse());
                    })
                  )
        ),
        map((response: RoleServerResponse) => new RolesListPageLoaded(response)),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private roleService: RoleService,
    ) {}
}
