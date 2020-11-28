import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ACTION_LABELS, BS_ICONS, THEME_PALETTE } from '@/shared/constants';

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
    <atoms-icon-button *ngIf="editForm && !isCreatePage" [icon]="actionIcons.save" (onclick)="updateClick.emit()">
      {{ actionLabels.SAVE }}
    </atoms-icon-button>
    <atoms-icon-button *ngIf="isCreatePage" buttons (onclick)="saveClick.emit()" [icon]="actionIcons.submit">
      {{ actionLabels.SUBMIT }}
    </atoms-icon-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesCardHeaderActionsComponent {
  @Input() editForm: boolean;
  @Input() isCreatePage: boolean;

  @Output() cancelClick: EventEmitter<any> = new EventEmitter();
  @Output() editClick: EventEmitter<any> = new EventEmitter();
  @Output() saveClick: EventEmitter<any> = new EventEmitter();
  @Output() updateClick: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  actionIcons: { [key: string]: BS_ICONS } = {
    edit: BS_ICONS.Pencil,
    cancel: BS_ICONS.X,
    save: BS_ICONS.ClipboardCheck,
    submit: BS_ICONS.Upload
  };
}
