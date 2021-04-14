import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@core/modules/user-api/shared';
import { BS_ICON, CommonConstants, MAT_BUTTON } from '@shared/constants';
import { DIALOG_TYPE } from '@shared/models';
import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';
import { IDialogResult } from '@shared/models/dialog/dialog-result';
import { DialogWithTwoButtonModel } from '@shared/models/dialog/dialog-with-two-button.model';
import { DialogService } from '@shared/services';

import { OrganismsUserDetailsDialogComponent } from '../../organisms/organisms-user-details-dialog/organisms-user-details-dialog.component';

@Component({
  selector: 'templates-box-user-list-sm',
  template: `
    <organisms-card
      [cardTitle]="cardTitle"
      [cardClass]="boxCss"
      contentClass="p-0"
      [disableShadow]="true"
      [counter]="users?.length"
    >
      <atoms-icon-button
        *ngIf="editMode"
        buttons
        [matType]="matButtonTypes.STROKED"
        [icon]="users?.length || user ? changeUserIcon : addUserIcon"
        (click)="onAddClick()"
        >{{ users?.length || user ? 'Change' : 'Add' }}</atoms-icon-button
      >

      <organisms-user-list-sm
        content
        [editMode]="editMode"
        [users]="users"
        [user]="user"
        (removeClick)="onRemoveClick($event)"
        (userClick)="openUserDetailsDialog($event)"
      ></organisms-user-list-sm>
    </organisms-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesBoxUserListSmComponent {
  @Input() editMode = false;
  @Input() users: User[];
  @Input() user: User;
  @Input() cardTitle: string;
  @Input() boxCss = 'border border-dark';

  @Output() addClick: EventEmitter<any> = new EventEmitter();
  @Output() removeClick: EventEmitter<number> = new EventEmitter();
  @Output() userClick: EventEmitter<User> = new EventEmitter();

  matButtonTypes = MAT_BUTTON;
  changeUserIcon = BS_ICON.PersonCheck;
  addUserIcon = BS_ICON.PersonPlus;

  constructor(private dialogService: DialogService, private route: Router) {}

  onAddClick(): void {
    this.addClick.emit();
  }

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

  openUserDetailsDialog(user: User): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(null, CommonConstants.TEXTS_MORE_DETAILS),
      model: user
    };

    this.dialogService
      .open(OrganismsUserDetailsDialogComponent, dialogDataModel, DIALOG_TYPE.STANDART)
      .afterClosed()
      .subscribe((result: IDialogResult<string>) => {
        if (result?.success) {
          this.route.navigateByUrl(result.data);
        }
      });
  }
}
