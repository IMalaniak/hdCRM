import { props, createAction } from '@ngrx/store';

export const toggleGoogleDriveIntegration = createAction('[Integrations] Google Drive Integration Toogle');

export const googleDriveIntegrationLoaded = createAction(
  '[Integrations API] Google Drive Integration Loaded',
  props<{ googleDriveToken: string }>()
);

export const googleDriveIntegrationDisable = createAction('[Integrations API] Google Drive Integration Disable');

export const integratioApiFailed = createAction('[Integrations API] Google Drive Integration API Failed');
