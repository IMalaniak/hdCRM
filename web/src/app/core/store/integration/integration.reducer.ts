import * as IntegrationActions from './integration.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface IntegrationsState {
  enabledGoogleDriveIntegration: boolean;
  isLoading: boolean;
}

export const initialIntegrationsState: IntegrationsState = {
  enabledGoogleDriveIntegration: false,
  isLoading: false
};

const reducer = createReducer(
  initialIntegrationsState,
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

export function integrationsReducer(state: IntegrationsState | undefined, action: Action) {
  return reducer(state, action);
}
