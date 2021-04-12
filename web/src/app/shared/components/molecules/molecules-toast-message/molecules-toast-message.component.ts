import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BS_ICON, NOTIFICATION_TYPE } from '@/shared/constants';
import { ToastMessage } from '@/shared/models/toastMessage';

@Component({
  selector: 'molecules-toast-message',
  template: `
    <mat-card
      [ngClass]="{
        'success-message': toast.type === notificationTypes.SUCCESS,
        'failed-message': toast.type === notificationTypes.ERROR,
        'warn-message': toast.type === notificationTypes.WARN,
        'info-message': toast.type === notificationTypes.INFO
      }"
    >
      <mat-card-content class="d-flex flex-row align-items-center p-1">
        <mat-icon [svgIcon]="cardIcons[toast.type]" aria-hidden="false"></mat-icon>
        <div class="ml-3">
          <span>{{ toast.message }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./molecules-toast-message.component.scss']
})
export class MoleculesToastMessageComponent {
  notificationTypes = NOTIFICATION_TYPE;
  cardIcons: { [key: string]: BS_ICON } = {
    [NOTIFICATION_TYPE.SUCCESS]: BS_ICON.Check,
    [NOTIFICATION_TYPE.ERROR]: BS_ICON.X,
    [NOTIFICATION_TYPE.INFO]: BS_ICON.Info,
    [NOTIFICATION_TYPE.WARN]: BS_ICON.Exclamation
  };
  constructor(@Inject(MAT_SNACK_BAR_DATA) public toast: ToastMessage) {}
}
