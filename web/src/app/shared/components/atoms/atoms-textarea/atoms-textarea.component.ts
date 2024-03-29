import { ChangeDetectionStrategy, Component, Input, Optional, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'atoms-textarea',
  template: `
    <input-validation-component
      [label]="label"
      [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
      [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
    >
      <textarea matInput trimInput [formControl]="control" [rows]="rows"></textarea>
    </input-validation-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsTextareaComponent }]
})
export class AtomsTextareaComponent extends BaseControlValueAccessorComponentModel<string | null | undefined> {
  @Input() canValidate = true;
  @Input() label = '';
  @Input() rows = 5;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
}
