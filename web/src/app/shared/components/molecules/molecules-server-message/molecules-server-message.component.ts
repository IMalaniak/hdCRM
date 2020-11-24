import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { BaseMessage } from '@/shared/models';
import { BS_ICONS } from '@/shared/constants';

@Component({
  selector: 'molecules-server-message',
  template: `
    <mat-card [ngClass]="{ 'success-message': serverResponse.success, 'failed-message': !serverResponse.success }">
      <mat-card-content class="d-flex flex-row align-items-center p-1">
        <mat-icon [svgIcon]="cardIcons[serverResponse.success ? 'success' : 'failure']" aria-hidden="false"></mat-icon>
        <div class="ml-3">
          <span>{{ serverResponse.message }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./molecules-server-message.component.scss']
})
export class MoleculesServerMessageComponent {
  cardIcons: { [key: string]: BS_ICONS } = {
    success: BS_ICONS.Check,
    failure: BS_ICONS.X
  };
  constructor(@Inject(MAT_SNACK_BAR_DATA) public serverResponse: BaseMessage) {}
}
