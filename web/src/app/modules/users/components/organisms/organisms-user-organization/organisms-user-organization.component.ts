import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { Organization } from '@/modules/users';
import { ACTION_LABELS, THEME_PALETTE, CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { AppState } from '@/core/reducers';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { DialogService } from '@/shared/services';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'organisms-user-organization',
  templateUrl: './organisms-user-organization.component.html',
  styleUrls: ['./organisms-user-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserOrganizationComponent implements OnInit {
  @Input() organization: Organization;
  @Input() editForm: boolean;
  @Input() canEdit = false;

  @Output() updateOrg: EventEmitter<Organization> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  userOrganizationFormValues: Organization;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  userOrganizationFormJson$: Observable<DynamicForm> = this.store$.pipe(
    select(selectFormByName(FORMCONSTANTS.USER_ORGANIZATION))
  );

  constructor(private store$: Store<AppState>, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: FORMCONSTANTS.USER_ORGANIZATION }));
  }

  organizationFormValueChanges(formVal: Organization): void {
    this.userOrganizationFormValues = { ...this.userOrganizationFormValues, ...formVal };
  }

  setFormEdit(edit: boolean): void {
    this.setEditableForm.emit(edit);
  }

  onUpdateOrgSubmit(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.updateOrg.emit({ ...this.organization, ...this.userOrganizationFormValues })
    );
  }
}
