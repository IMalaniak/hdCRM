import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Organization } from '@/modules/users';
import { ACTION_LABELS, THEME_PALETTE, CONSTANTS } from '@/shared/constants';
import { DialogConfirmModal } from '@/shared/models/modal/dialog-question.model';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogService } from '@/core/services/dialog';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'organisms-user-organization',
  templateUrl: './organisms-user-organization.component.html',
  styleUrls: ['./organisms-user-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserOrganizationComponent implements OnDestroy {
  @Input() organization: Organization;
  @Input() editForm: boolean;
  @Input() canEdit = false;

  @Output() updateOrg: EventEmitter<Organization> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dialogService: DialogService) {}

  setFormEdit(edit: boolean): void {
    this.setEditableForm.emit(edit);
  }

  onUpdateOrgSubmit(): void {
    const dialogModel: DialogConfirmModal = new DialogConfirmModal(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: boolean) => {
        if (result) {
          this.updateOrg.emit(this.organization);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
