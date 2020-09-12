import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Organization } from '@/modules/users';
import { ToastMessageService } from '@/shared/services';
import { DIALOG, ACTION_LABELS, THEME_PALETTE, CONSTANTS } from '@/shared/constants';

@Component({
  selector: 'organisms-user-organization',
  templateUrl: './organisms-user-organization.component.html',
  styleUrls: ['./organisms-user-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserOrganizationComponent {
  @Input() organization: Organization;
  @Input() editForm: boolean;
  @Input() canEdit = false;

  @Output() updateOrg: EventEmitter<Organization> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(private toastMessageService: ToastMessageService) {}

  setFormEdit(edit: boolean): void {
    this.setEditableForm.emit(edit);
  }

  onUpdateOrgSubmit(): void {
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM).then((result) => {
      if (result.value) {
        this.updateOrg.emit(this.organization);
      }
    });
  }
}
