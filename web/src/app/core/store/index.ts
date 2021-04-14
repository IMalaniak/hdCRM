import { routerReducer, RouterReducerState, SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';

import { DynamicFormState, formReducer } from './dynamic-form';
import { integrationsReducer, IntegrationsState } from './integration';
import { notificationsReducer, NotificationsState } from './notifications';
import { preferencesReducer, PreferencesState } from './preferences';

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
