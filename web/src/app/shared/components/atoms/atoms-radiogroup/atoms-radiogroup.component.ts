import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';
import { THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'atoms-radiogroup',
  template: `
    <h5>{{ label }}</h5>
    <mat-radio-group
      [formControl]="ngControl.control"
      [ngClass]="{ 'd-flex flex-column': optionsColumn }"
      [color]="color"
      (change)="onChange.emit($event)"
    >
      <mat-radio-button *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-radio-button>
    </mat-radio-group>
  `,
  styleUrls: ['./atoms-radiogroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsRadiogroupComponent }]
})
export class AtomsRadiogroupComponent extends BaseControlValueAccessorComponentModel<boolean> {
  @Input() label = '';
  @Input() options: string | number;
  @Input() optionsColumn = true;
  @Input() color: ThemePalette = THEME_PALETTE.ACCENT;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<MatCheckboxChange> = new EventEmitter();

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
