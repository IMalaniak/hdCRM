import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-list-sm',
  template: `
    <mat-selection-list [multiple]="false" class="pt-0">
      <molecules-user-list-sm-item
        *ngFor="let user of users; last as last"
        [editMode]="editMode"
        [user]="user"
        [isLast]="last"
        (removeClick)="onRemoveClick($event)"
        (userClick)="onUserClick($event)"
      ></molecules-user-list-sm-item>
    </mat-selection-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserListSmComponent {
  @Input() editMode = false;
  @Input() users: User[];

  @Output() removeClick: EventEmitter<number> = new EventEmitter();
  @Output() userClick: EventEmitter<User> = new EventEmitter();

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

  onUserClick(user: User): void {
    this.userClick.emit(user);
  }
}
