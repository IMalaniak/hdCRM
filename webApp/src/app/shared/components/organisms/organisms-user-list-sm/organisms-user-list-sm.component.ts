import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-list-sm',
  template: `
    <mat-selection-list [multiple]="false" class="pt-0">
      <ng-container *ngIf="users?.length">
        <molecules-user-list-sm-item
          *ngFor="let user of users; last as last"
          [editMode]="editMode"
          [user]="user"
          [isLast]="last"
          (removeClick)="onRemoveClick($event)"
          (userClick)="onUserClick($event)"
        ></molecules-user-list-sm-item>
      </ng-container>

      <ng-container *ngIf="user">
        <molecules-user-list-sm-item
          [editMode]="editMode"
          [user]="user"
          [isLast]="true"
          (removeClick)="onRemoveClick($event)"
          (userClick)="onUserClick($event)"
        ></molecules-user-list-sm-item>
      </ng-container>
    </mat-selection-list>
  `
})
export class OrganismsUserListSmComponent {
  @Input() editMode = false;
  @Input() users: User[];
  @Input() user: User;

  @Output() removeClick: EventEmitter<number> = new EventEmitter();
  @Output() userClick: EventEmitter<User> = new EventEmitter();

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

  onUserClick(user: User): void {
    this.userClick.emit(user);
  }
}
