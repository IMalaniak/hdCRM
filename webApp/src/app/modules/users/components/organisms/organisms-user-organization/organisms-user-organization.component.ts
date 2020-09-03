import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Organization } from '@/modules/users';
import { ToastMessageService } from '@/shared/services';

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

  constructor(private toastMessageService: ToastMessageService) {}

  setFormEdit(edit: boolean): void {
    this.setEditableForm.emit(edit);
  }

  onUpdateOrgSubmit(): void {
    this.toastMessageService
      .confirm('Are you sure?', 'Do you really want to save changes? You will not be able to recover this!')
      .then((result) => {
        if (result.value) {
          this.updateOrg.emit(this.organization);
        }
      });
  }
}
