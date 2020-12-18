import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';

import * as fromRouter from '@ngrx/router-store';
import { SerializedRouterStateSnapshot } from '@ngrx/router-store';

import * as fromPreferences from './preferences/preferences.reducer';
import * as fromIntegrations from './integration/integration.reducer';
import * as fromDynamicForm from './dynamic-form/dynamic-form.reducer';
import * as fromNotifications from './notifications/notifications.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState<SerializedRouterStateSnapshot>;
  preferences: fromPreferences.PreferencesState;
  integrations: fromIntegrations.IntegrationsState;
  forms: fromDynamicForm.DynamicFormState;
  notifications: fromNotifications.NotificationsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  preferences: fromPreferences.reducer,
  integrations: fromIntegrations.reducer,
  forms: fromDynamicForm.reducer,
  notifications: fromNotifications.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
