import { ChangeDetectionStrategy, Component, Input, Optional, Self } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'atoms-select',
  template: `
    <input-validation-component
      [label]="label"
      [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
      [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
    >
      <mat-select [formControl]="ngControl.control">
        <mat-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-option>
      </mat-select>
    </input-validation-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsSelectComponent }]
})
export class AtomsSelectComponent extends BaseControlValueAccessorComponentModel<string | number | null | undefined> {
  @Input() canValidate = true;
  @Input() label = '';
  @Input() options: string | number;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
