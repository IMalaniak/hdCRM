import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users/models';

@Component({
  selector: 'molecules-user-list-sm-item',
  template: `
    <mat-list-option (click)="onUserClick(user)">
      <div class="d-flex flex-row align-items-center">
        <atoms-user-pic matListAvatar [avatar]="user.avatar" [userOnline]="user.online"></atoms-user-pic>

        <atoms-link-button [linkLabel]="user.fullname"></atoms-link-button>

        <atoms-icon-button
          *ngIf="editMode"
          matType="icon"
          color="warn"
          [icon]="['fas', 'trash']"
          class="ml-auto"
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
  @Output() userClick: EventEmitter<User> = new EventEmitter();

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

  onUserClick(user: User): void {
    this.userClick.emit(user);
  }
}
