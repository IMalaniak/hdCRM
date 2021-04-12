import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ACTION_LABEL, BS_ICON, THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'molecules-card-header-actions',
  template: `
    <atoms-icon-button *ngIf="!editForm && !isCreatePage" [icon]="actionIcons.edit" (onclick)="editClick.emit()">
      {{ actionLabels.EDIT }}
    </atoms-icon-button>
    <atoms-icon-button
      *ngIf="editForm && !isCreatePage"
      [color]="themePalette.BASIC"
      [icon]="actionIcons.cancel"
      (onclick)="cancelClick.emit()"
    >
      {{ actionLabels.CANCEL }}
    </atoms-icon-button>
    <atoms-icon-button
      *ngIf="editForm && !isCreatePage"
      [icon]="actionIcons.save"
      [isLoading]="isLoading"
      [disabled]="disabled"
      (onclick)="updateClick.emit()"
    >
      {{ actionLabels.SAVE }}
    </atoms-icon-button>
    <atoms-icon-button
      *ngIf="isCreatePage"
      buttons
      [icon]="actionIcons.submit"
      [isLoading]="isLoading"
      [disabled]="disabled"
      (onclick)="saveClick.emit()"
    >
      {{ actionLabels.SUBMIT }}
    </atoms-icon-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesCardHeaderActionsComponent {
  @Input() editForm: boolean;
  @Input() isCreatePage: boolean;
  @Input() disabled = false;
  @Input() isLoading = false;

  @Output() cancelClick: EventEmitter<any> = new EventEmitter();
  @Output() editClick: EventEmitter<any> = new EventEmitter();
  @Output() saveClick: EventEmitter<any> = new EventEmitter();
  @Output() updateClick: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;
  actionIcons: { [key: string]: BS_ICON } = {
    edit: BS_ICON.Pencil,
    cancel: BS_ICON.X,
    save: BS_ICON.ClipboardCheck,
    submit: BS_ICON.Upload
  };
}
