import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-list-sm',
  template: `
    <mat-list>
      <molecules-user-list-sm-item *ngFor="let user of users" [editMode]="editMode" [user]="user" (removeClick)="onRemoveClick($event)"></molecules-user-list-sm-item>
    </mat-list>
  `
})
export class OrganismsUserListSmComponent {
  @Input() editMode = false;
  @Input() users: User[];
  @Output() removeClick = new EventEmitter();

  constructor() {}

  onRemoveClick(id: number) {
    this.removeClick.emit(id);
  }
}
