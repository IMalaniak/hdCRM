import { ActionReducerMap, MetaReducer, createFeatureSelector } from '@ngrx/store';
import { environment } from 'environments/environment';

import * as fromRouter from '@ngrx/router-store';
import * as fromPreferences from './preferences.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState<any>;
  preferences: fromPreferences.PreferencesState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  preferences: fromPreferences.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const selectRouter = createFeatureSelector<AppState, fromRouter.RouterReducerState<any>>('router');

export const {
  selectCurrentRoute, // select the current route
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl // select the current url
} = fromRouter.getSelectors(selectRouter);
