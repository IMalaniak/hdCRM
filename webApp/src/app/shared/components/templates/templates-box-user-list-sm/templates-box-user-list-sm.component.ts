import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'templates-box-user-list-sm',
  template: `
    <section
      class="app-content-box"
      [title]="title"
      [cssClass]="'border border-secondary mt-3 mt-sm-0'"
      [contentCssClass]="'p-0'"
      [disableShadow]="true"
      [counter]="users.length"
    >
      <atoms-icon-button *ngIf="editMode" buttons type="stroked" [icon]="['fas', 'user-plus']" (click)="onAddClick()">Add</atoms-icon-button>

      <organisms-user-list-sm content [editMode]="editMode" [users]="users" (removeClick)="onRemoveClick($event)"></organisms-user-list-sm>
    </section>
  `,
  styleUrls: ['./templates-box-user-list-sm.component.scss']
})
export class TemplatesBoxUserListSmComponent implements OnInit {
  @Input() editMode = false;
  @Input() users: User[];
  @Input() title: string;
  @Output() addClick = new EventEmitter();
  @Output() removeClick = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onAddClick() {
    this.addClick.emit();
  }
  onRemoveClick(id: number) {
    this.removeClick.emit(id);
  }

}
