import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-list-sm',
  template: `
    <mat-list>
      <molecules-user-list-sm-item *ngFor="let user of users" [editMode]="editMode" [user]="user" (removeClick)="onRemoveClick($event)"></molecules-user-list-sm-item>
    </mat-list>
  `,
  styleUrls: ['./organisms-user-list-sm.component.scss']
})
export class OrganismsUserListSmComponent implements OnInit {
  @Input() editMode = false;
  @Input() users: User[];
  @Output() removeClick = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onRemoveClick(id: number) {
    this.removeClick.emit(id);
  }
}
