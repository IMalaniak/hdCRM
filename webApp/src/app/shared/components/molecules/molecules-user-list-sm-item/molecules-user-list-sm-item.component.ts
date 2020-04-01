import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@/modules/users/models';

@Component({
  selector: 'molecules-user-list-sm-item',
  template: `
    <mat-list-item>
      <atoms-user-pic matListAvatar [avatar]="user.avatar" [userOnline]="user.online"></atoms-user-pic>
      <h3 matLine>
        <a href="#">{{ user.fullname }}</a>
      </h3>
      <fa-icon *ngIf="editMode" [icon]="['fas', 'trash']" class="text-danger cursor-pointer" (click)="onRemoveClick(user.id)"></fa-icon>
      <mat-divider></mat-divider>
    </mat-list-item>
  `
})
export class MoleculesUserListSmItemComponent implements OnInit {
  @Input() user: User;
  @Input() editMode = false;
  @Output() removeClick = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onRemoveClick(id: number) {
    this.removeClick.emit(id);
  }
}
