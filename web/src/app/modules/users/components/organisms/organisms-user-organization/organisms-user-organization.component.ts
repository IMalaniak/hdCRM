import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Organization } from '@/modules/users';
import { ToastMessageService } from '@/shared/services';
import { DIALOG, ACTION_LABELS, THEME_PALETTE, CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';

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

  constructor(private toastMessageService: ToastMessageService, private store$: Store<AppState>) {}

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
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM).then((result) => {
      if (result.value) {
        this.updateOrg.emit({ ...this.organization, ...this.userOrganizationFormValues });
      }
    });
  }
}
