import { props, createAction } from '@ngrx/store';

const prefix = '[Integrations]';
const apiPrefix = '[Integrations API]';

export const toggleGoogleDriveIntegration = createAction(`${prefix} Toggle Google Drive Integration`);

export const googleDriveIntegrationLoaded = createAction(
  `${apiPrefix} Google Drive Integration Loaded`,
  props<{ googleDriveToken: string }>()
);

export const googleDriveIntegrationDisable = createAction(`${apiPrefix} Google Drive Integration Disable`);

export const integratioApiFailed = createAction(`${apiPrefix} Google Drive Integration API Failed`);
