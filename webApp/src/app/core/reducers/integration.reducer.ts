import * as IntegrationActions from './integration.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface IntegrationsState {
  enableGoogleDriveIntegration: boolean;
  isLoading: boolean;
}

const initialState: IntegrationsState = {
  enableGoogleDriveIntegration: false,
  isLoading: false
};

const integrationsReducer = createReducer(
  initialState,
  on(IntegrationActions.googleDriveIntegrationLoaded, (state, { googleDriveToken }) => ({
    ...state,
    googleDriveToken,
    enableGoogleDriveIntegration: true
  })),
  on(IntegrationActions.googleDriveIntegrationDisable, state => ({
    ...state,
    googleDriveToken: null,
    enableGoogleDriveIntegration: false
  }))
);

export function reducer(state: IntegrationsState | undefined, action: Action) {
  return integrationsReducer(state, action);
}
