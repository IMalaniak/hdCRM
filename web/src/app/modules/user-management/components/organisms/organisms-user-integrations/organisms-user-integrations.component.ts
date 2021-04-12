import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/store';
import { toggleGoogleDriveIntegration, getGoogleDriveIntegrationState } from '@/core/store/integration';

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
