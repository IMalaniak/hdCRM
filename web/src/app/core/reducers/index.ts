import { ActionReducerMap, MetaReducer, createFeatureSelector } from '@ngrx/store';
import { environment } from 'environments/environment';

import * as fromRouter from '@ngrx/router-store';

import { RouterStateUrl } from '@/shared/utils';
import * as fromPreferences from './preferences.reducer';
import * as fromIntegrations from './integration.reducer';
import * as fromDynamicForm from './/dynamic-form/dynamic-form.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  preferences: fromPreferences.PreferencesState;
  integrations: fromIntegrations.IntegrationsState;
  forms: fromDynamicForm.DynamicFormState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  preferences: fromPreferences.reducer,
  integrations: fromIntegrations.reducer,
  forms: fromDynamicForm.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const selectRouter = createFeatureSelector<AppState, fromRouter.RouterReducerState<RouterStateUrl>>('router');

export const {
  selectCurrentRoute, // select the current route
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl // select the current url
} = fromRouter.getSelectors(selectRouter);
