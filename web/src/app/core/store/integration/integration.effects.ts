import { Injectable } from '@angular/core';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ToastMessageService } from '@/shared/services';
import { CommonConstants } from '@/shared/constants';

import { IntegrationsService } from '../../services/integrations.service';
import { AppState } from '../index';

import * as integrationsActions from './integration.actions';
import { getGoogleDriveIntegrationState } from './integration.selectors';

@Injectable()
export class IntegrationsEffects {
  toggleGoogleDriveIntegration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(integrationsActions.toggleGoogleDriveIntegration),
      withLatestFrom(this.store$.pipe(select(getGoogleDriveIntegrationState))),
      mergeMap(([_, googleDriveIntegrationState]) => {
        if (!googleDriveIntegrationState) {
          return this.integrationsService.getGoogleDriveToken().pipe(
            map((googleDriveToken) => {
              this.toastMessageService.success(CommonConstants.TEXTS_GOOGLE_DRIVE_INTEGRATION_ENABLED);
              return integrationsActions.googleDriveIntegrationLoaded({ googleDriveToken });
            })
          );
        } else {
          return this.integrationsService.removeGoogleDriveToken().pipe(
            map(() => {
              this.toastMessageService.success(CommonConstants.TEXTS_GOOGLE_DRIVE_INTEGRATION_DISABLED);
              return integrationsActions.googleDriveIntegrationDisable();
            })
          );
        }
      })
    )
  );

  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private integrationsService: IntegrationsService,
    private toastMessageService: ToastMessageService
  ) {}
}
