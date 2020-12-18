import { Component, Input, EventEmitter, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { selectFormByName, formRequested } from '@/core/store/dynamic-form';
import { DialogDataModel, DynamicForm } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { ACTION_LABELS, CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-details',
  templateUrl: './organisms-user-details.component.html',
  styleUrls: ['./organisms-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() canEdit = false;
  @Input() editForm: boolean;

  @Output() updateUser: EventEmitter<User> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  userFormValues: User;

  actionLabels = ACTION_LABELS;

  userFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName(FORMCONSTANTS.USER)));

  constructor(private store$: Store<AppState>, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: FORMCONSTANTS.USER }));
  }

  userFormValueChanges(formVal: User): void {
    this.userFormValues = { ...this.userFormValues, ...formVal };
  }

  onClickEdit(): void {
    this.setEditableForm.emit(true);
  }

  onClickCancelEdit(): void {
    this.setEditableForm.emit(false);
    // this.userForm.reset(this.user);
  }

  onUpdateUserSubmit(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.updateUser.emit({ ...this.user, ...this.userFormValues })
    );
  }
}
