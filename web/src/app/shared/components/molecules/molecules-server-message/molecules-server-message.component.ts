import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BaseMessage } from '@/shared/models';

@Component({
  selector: 'molecules-server-message',
  template: `
    <mat-card [ngClass]="{ 'success-message': serverResponse.success, 'failed-message': !serverResponse.success }">
      <mat-card-content class="d-flex flex-row align-items-center p-1">
        <fa-icon [icon]="serverResponse.success ? ['fas', 'check'] : ['fas', 'times']"></fa-icon>
        <div class="ml-3">
          <span>{{ serverResponse.message }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./molecules-server-message.component.scss']
})
export class MoleculesServerMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public serverResponse: BaseMessage) {}
}
