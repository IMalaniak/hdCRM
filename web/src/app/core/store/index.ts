import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';
import { routerReducer, RouterReducerState, SerializedRouterStateSnapshot } from '@ngrx/router-store';

import { preferencesReducer, PreferencesState } from './preferences';
import { integrationsReducer, IntegrationsState } from './integration';
import { DynamicFormState, formReducer } from './dynamic-form';
import { notificationsReducer, NotificationsState } from './notifications';

export interface AppState {
  router: RouterReducerState<SerializedRouterStateSnapshot>;
  preferences: PreferencesState;
  integrations: IntegrationsState;
  forms: DynamicFormState;
  notifications: NotificationsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  preferences: preferencesReducer,
  integrations: integrationsReducer,
  forms: formReducer,
  notifications: notificationsReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
