import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers/index';

export const getIntegrationsState = (state: AppState) => state.integrations;
export const getGoogleDriveIntegrationState = createSelector(
  getIntegrationsState,
  state => state.enableGoogleDriveIntegration
);
