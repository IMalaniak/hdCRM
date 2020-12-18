import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { toggleGoogleDriveIntegration } from '@/core/reducers/integration/integration.actions';
import { getGoogleDriveIntegrationState } from '@/core/reducers/integration/integration.selectors';

@Component({
  selector: 'organisms-user-integrations',
  templateUrl: './organisms-user-integrations.component.html'
})
export class OrganismsUserIntegrationsComponent {
  googleDriveIntegrationState$: Observable<boolean> = this.store$.pipe(select(getGoogleDriveIntegrationState));

  constructor(private store$: Store<AppState>) {}

  toggleGDriveIntegration(): void {
    this.store$.dispatch(toggleGoogleDriveIntegration());
  }
}
