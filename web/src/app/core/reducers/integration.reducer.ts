import * as IntegrationActions from './integration.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface IntegrationsState {
  enabledGoogleDriveIntegration: boolean;
  isLoading: boolean;
}

const initialState: IntegrationsState = {
  enabledGoogleDriveIntegration: false,
  isLoading: false
};

const integrationsReducer = createReducer(
  initialState,
  on(IntegrationActions.googleDriveIntegrationLoaded, (state, { googleDriveToken }) => ({
    ...state,
    googleDriveToken,
    enabledGoogleDriveIntegration: true
  })),
  on(IntegrationActions.googleDriveIntegrationDisable, (state) => ({
    ...state,
    googleDriveToken: null,
    enabledGoogleDriveIntegration: false
  }))
);

export function reducer(state: IntegrationsState | undefined, action: Action) {
  return integrationsReducer(state, action);
}
