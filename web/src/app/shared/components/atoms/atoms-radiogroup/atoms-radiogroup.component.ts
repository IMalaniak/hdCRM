import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatRadioChange } from '@angular/material/radio';

import { THEME_PALETTE } from '@shared/constants';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'atoms-radiogroup',
  template: `
    <h5>{{ label }}</h5>
    <mat-radio-group
      [formControl]="control"
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
export class AtomsRadiogroupComponent extends BaseControlValueAccessorComponentModel<any[]> {
  @Input() label = '';
  @Input() options: any[];
  @Input() optionsColumn = true;
  @Input() color: ThemePalette = THEME_PALETTE.PRIMARY;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange: EventEmitter<MatRadioChange> = new EventEmitter();

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
}
