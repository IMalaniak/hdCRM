import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { toggleGoogleDriveIntegration } from '@/core/reducers/integration.actions';
import { getGoogleDriveIntegrationState } from '@/core/reducers/integration.selectors';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'organisms-user-integrations',
  templateUrl: './organisms-user-integrations.component.html',
  styleUrls: ['./organisms-user-integrations.component.scss']
})
export class OrganismsUserIntegrationsComponent {
  googleDriveIntegrationState$: Observable<boolean> = this.store$.pipe(select(getGoogleDriveIntegrationState));

  constructor(private store$: Store<AppState>) {}

  enableGoogleDriveIntegration(): void {
    this.store$.dispatch(toggleGoogleDriveIntegration());
  }
}
