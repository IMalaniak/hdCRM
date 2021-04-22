import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';

import { THEME_PALETTE } from '@shared/constants';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'atoms-checkbox',
  template: `
    <mat-checkbox [formControl]="control" [color]="color" (change)="onChange.emit($event)">
      {{ label }}
    </mat-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsCheckboxComponent }]
})
export class AtomsCheckboxComponent extends BaseControlValueAccessorComponentModel<boolean> {
  @Input() label = '';
  @Input() color: ThemePalette = THEME_PALETTE.ACCENT;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange: EventEmitter<MatCheckboxChange> = new EventEmitter();

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
}
