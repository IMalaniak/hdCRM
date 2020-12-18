import { SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { AppState } from './index';

export const selectRouterState = createFeatureSelector<
  AppState,
  fromRouter.RouterReducerState<SerializedRouterStateSnapshot>
>('router');

export const {
  selectCurrentRoute, // select the current route
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl // select the current url
} = fromRouter.getSelectors(selectRouterState);

export const selectRoute = createSelector(selectRouterState, (routerState) => routerState.state.root);
