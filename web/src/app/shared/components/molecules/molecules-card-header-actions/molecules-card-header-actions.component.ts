import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'molecules-card-header-actions',
  template: `
    <atoms-icon-button *ngIf="!editForm" [icon]="['fas', 'edit']" (onclick)="editClick.emit()">
      {{ actionLabels.EDIT }}
    </atoms-icon-button>
    <atoms-icon-button
      *ngIf="editForm"
      [color]="themePalette.BASIC"
      [icon]="['fas', 'times']"
      (onclick)="cancelClick.emit()"
    >
      {{ actionLabels.CANCEL }}
    </atoms-icon-button>
    <atoms-icon-button *ngIf="editForm" [icon]="['fas', 'save']" (onclick)="saveClick.emit()">
      {{ actionLabels.SAVE }}
    </atoms-icon-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesCardHeaderActionsComponent {
  @Input() editForm: boolean;

  @Output() cancelClick: EventEmitter<any> = new EventEmitter();
  @Output() editClick: EventEmitter<any> = new EventEmitter();
  @Output() saveClick: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
}
