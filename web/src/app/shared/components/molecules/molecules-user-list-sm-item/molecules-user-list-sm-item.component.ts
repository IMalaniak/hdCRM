import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

import { User } from '@core/modules/user-api/shared';
import { THEME_PALETTE, MAT_BUTTON, BS_ICON } from '@shared/constants';

@Component({
  selector: 'molecules-user-list-sm-item',
  template: `
    <mat-list-option [value]="user">
      <div class="d-flex flex-row align-items-center">
        <atoms-user-pic matListAvatar [picture]="user.picture" [userOnline]="user.online" class="m-0"></atoms-user-pic>

        <atoms-link-button [linkLabel]="user.fullname"></atoms-link-button>

        <atoms-icon-button
          *ngIf="editMode"
          [matType]="matButtonTypes.ICON"
          [color]="themePalette.WARN"
          [icon]="removeIcon"
          class="ms-auto"
          (onclick)="onRemoveClick(user.id); $event.stopPropagation()"
        >
        </atoms-icon-button>
      </div>
      <mat-divider *ngIf="!isLast"></mat-divider>
    </mat-list-option>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesUserListSmItemComponent {
  @Input() user: User;
  @Input() editMode = false;
  @Input() isLast: boolean;

  @Output() removeClick: EventEmitter<number> = new EventEmitter();

  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;
  removeIcon = BS_ICON.X;

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }
}
