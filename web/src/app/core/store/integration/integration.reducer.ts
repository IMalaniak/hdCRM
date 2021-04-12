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

export const integrationsReducer = (state: IntegrationsState | undefined, action: Action) => reducer(state, action);
