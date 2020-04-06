import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@/modules/users';

@Component({
  selector: 'templates-box-user-list-sm',
  template: `
    <section
      class="app-content-box"
      [title]="title"
      [cssClass]="boxCss"
      contentCssClass="p-0"
      [disableShadow]="true"
      [counter]="users.length"
    >
      <atoms-icon-button *ngIf="editMode" buttons type="stroked" [icon]="['fas', 'user-plus']" (click)="onAddClick()">Add</atoms-icon-button>

      <organisms-user-list-sm content [editMode]="editMode" [users]="users" (removeClick)="onRemoveClick($event)"></organisms-user-list-sm>
    </section>
  `
})
export class TemplatesBoxUserListSmComponent {
  @Input() editMode = false;
  @Input() users: User[];
  @Input() title: string;
  @Output() addClick: EventEmitter<any> = new EventEmitter();
  @Output() removeClick: EventEmitter<number> = new EventEmitter();
  @Input() boxCss = 'border border-secondary mt-3 mt-sm-0';

  onAddClick(): void {
    this.addClick.emit();
  }
  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

}
