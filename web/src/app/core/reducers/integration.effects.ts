import { Injectable } from '@angular/core';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as integrationsActions from './integration.actions';
import { IntegrationsService } from '../services/integrations.service';
import { AppState } from './index';
import { Store, select } from '@ngrx/store';
import { getGoogleDriveIntegrationState } from './integration.selectors';
import { ToastMessageService } from '@/shared/services';
import { ApiResponse } from '@/shared/models';
import { CONSTANTS } from '@/shared/constants';

@Injectable()
export class IntegrationsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private integrationsService: IntegrationsService,
    private toastMessageService: ToastMessageService
  ) {}

  toggleGoogleDriveIntegration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(integrationsActions.toggleGoogleDriveIntegration),
      withLatestFrom(this.store$.pipe(select(getGoogleDriveIntegrationState))),
      mergeMap(([_, googleDriveIntegrationState]) => {
        if (!googleDriveIntegrationState) {
          return this.integrationsService.getGoogleDriveToken().pipe(
            map((googleDriveToken) => {
              const response: ApiResponse = {
                success: true,
                message: CONSTANTS.TEXTS_GOOGLE_DRIVE_INTEGRATION_ENABLED
              };
              this.toastMessageService.snack(response);
              return integrationsActions.googleDriveIntegrationLoaded({ googleDriveToken });
            })
          );
        } else {
          return this.integrationsService.removeGoogleDriveToken().pipe(
            map(() => {
              const response: ApiResponse = {
                success: false,
                message: CONSTANTS.TEXTS_GOOGLE_DRIVE_INTEGRATION_DISABLED
              };
              this.toastMessageService.snack(response);
              return integrationsActions.googleDriveIntegrationDisable();
            })
          );
        }
      })
    )
  );
}
