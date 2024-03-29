import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Organization } from '@core/modules/user-api/shared';
import { AppState } from '@core/store';
import { BaseDynamicFormPageModel } from '@shared/components/base/models/base-dynamic-form-page.model';
import { DialogConfirmComponent } from '@shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { ACTION_LABEL, CommonConstants, FormNameConstants } from '@shared/constants';
import { DialogConfirmModel } from '@shared/models/dialog/dialog-confirm.model';
import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';
import { DialogService } from '@shared/services';

@Component({
  selector: 'organisms-user-organization',
  templateUrl: './organisms-user-organization.component.html',
  styleUrls: ['./organisms-user-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserOrganizationComponent extends BaseDynamicFormPageModel<Organization> {
  @Input() organization: Organization;
  @Input() editForm: boolean;
  @Input() canEdit = false;

  @Output() updateOrg: EventEmitter<Organization> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  actionLabels = ACTION_LABEL;
  protected readonly formName = FormNameConstants.USER_ORGANIZATION;

  constructor(protected readonly store$: Store<AppState>, private readonly dialogService: DialogService) {
    super(store$);
  }

  setFormEdit(edit: boolean): void {
    this.setEditableForm.emit(edit);
  }

  onUpdateOrgSubmit(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CommonConstants.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.updateOrg.emit({ ...this.organization, ...this.getFormValues() })
    );
  }
}
