import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@/modules/users/models';

@Component({
  selector: 'molecules-user-list-sm-item',
  template: `
    <mat-list-item>
      <atoms-user-pic matListAvatar [avatar]="user.avatar" [userOnline]="user.online"></atoms-user-pic>
      <h3 matLine>
        <a [routerLink]="['/users/details/', user.id]">{{ user.fullname }}</a>
      </h3>
      <atoms-icon-button
        *ngIf="editMode"
        color="warn"
        [icon]="['fas', 'trash']"
        matType="icon"
        (onclick)="onRemoveClick(user.id)"
      >
      </atoms-icon-button>
      <mat-divider></mat-divider>
    </mat-list-item>
  `
})
export class MoleculesUserListSmItemComponent {
  @Input() user: User;
  @Input() editMode = false;
  @Output() removeClick: EventEmitter<number> = new EventEmitter();

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }
}
