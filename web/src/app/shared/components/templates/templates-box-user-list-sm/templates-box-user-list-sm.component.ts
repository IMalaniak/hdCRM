import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { User } from '@/modules/users';
import { OrganismsUserDetailsDialogComponent } from '../../organisms/organisms-user-details-dialog/organisms-user-details-dialog.component';
import { CONSTANTS, MAT_BUTTON } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogWithTwoButtonModel } from '@/shared/models/modal/dialog-with-two-button.model';
import { DialogService } from '@/core/services/dialog/dialog.service';
import { ModalDialogResult } from '@/shared/models/modal/modal-dialog-result.model';
import { BaseModel } from '@/shared/models/base';

@Component({
  selector: 'templates-box-user-list-sm',
  template: `
    <organisms-card
      [cardTitle]="title"
      [cardClass]="boxCss"
      contentClass="p-0"
      [disableShadow]="true"
      [counter]="users?.length"
    >
      <atoms-icon-button
        *ngIf="editMode"
        buttons
        [matType]="matButtonTypes.STROKED"
        [icon]="['fas', 'user-plus']"
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
export class TemplatesBoxUserListSmComponent implements OnDestroy {
  @Input() editMode = false;
  @Input() users: User[];
  @Input() user: User;
  @Input() title: string;
  @Input() boxCss = 'border border-secondary mt-3 mt-sm-0';

  @Output() addClick: EventEmitter<any> = new EventEmitter();
  @Output() removeClick: EventEmitter<number> = new EventEmitter();
  @Output() userClick: EventEmitter<User> = new EventEmitter();

  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dialogService: DialogService, private route: Router) {}

  onAddClick(): void {
    this.addClick.emit();
  }

  onRemoveClick(id: number): void {
    this.removeClick.emit(id);
  }

  openUserDetailsDialog(user: User): void {
    const dialogDataModel = new DialogDataModel(
      new DialogWithTwoButtonModel(null, CONSTANTS.TEXTS_MORE_DETAILS),
      user as BaseModel
    );

    this.dialogService
      .open(OrganismsUserDetailsDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<string>) => {
        if (result && result.result) {
          this.route.navigateByUrl(result.model);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
