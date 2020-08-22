import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as integrationsActions from './integration.actions';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { IntegrationsService } from '../services/integrations.service';
import { ToastMessageService } from '@/shared/services';
import { AppState } from '.';
import { Store, select } from '@ngrx/store';
import { getGoogleDriveIntegrationState } from './integration.selectors';

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
            map(googleDriveToken => {
              this.toastMessageService.toast('Google Drive integration is enabled!', 'success');
              return integrationsActions.googleDriveIntegrationLoaded({ googleDriveToken });
            })
          );
        } else {
          return this.integrationsService.removeGoogleDriveToken().pipe(
            map(() => {
              this.toastMessageService.toast('Google Drive integration is disabled!', 'info');
              return integrationsActions.googleDriveIntegrationDisable();
            })
          );
        }
      })
    )
  );
}
