import { Component, Input, EventEmitter, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { User } from '@/modules/users';
import { DialogDataModel, DynamicForm } from '@/shared/models';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { ACTION_LABELS, THEME_PALETTE, CONSTANTS } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/core/services/dialog';

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
  themePalette = THEME_PALETTE;

  userFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('user')));

  constructor(private store$: Store<AppState>, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'user' }));
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
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => this.updateUser.emit({ ...this.user, ...this.userFormValues }));
  }
}
