import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { User } from '@/core/modules/user-api/shared';
import { DialogDataModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { ACTION_LABELS, CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { BaseDynamicFormPageModel } from '@/shared/components/base/models/base-dynamic-form-page.model';

@Component({
  selector: 'organisms-user-details',
  templateUrl: './organisms-user-details.component.html',
  styleUrls: ['./organisms-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsComponent extends BaseDynamicFormPageModel<User> {
  @Input() user: User;
  @Input() canEdit = false;
  @Input() editForm: boolean;

  @Output() updateUser: EventEmitter<User> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  protected formName = FORMCONSTANTS.USER;

  constructor(protected readonly store$: Store<AppState>, private readonly dialogService: DialogService) {
    super(store$);
  }

  onClickEdit(): void {
    this.setEditableForm.emit(true);
  }

  onClickCancelEdit(): void {
    this.setEditableForm.emit(false);
  }

  onUpdateUserSubmit(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.updateUser.emit({ ...this.user, ...this.getFormValues() })
    );
  }
}
