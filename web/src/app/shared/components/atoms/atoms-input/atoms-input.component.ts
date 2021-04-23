import { Component, Input, Optional, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

import { INPUT_TYPE } from '@shared/constants';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

import { Autocomplete } from './autocomplete';

@Component({
  selector: 'atoms-input',
  template: `
    <input-validation-component
      [label]="label"
      [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
      [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
    >
      <input matInput trimInput [type]="inputType" [formControl]="control" [autocomplete]="autocomplete" />
      <ng-content prefix select="[prefix]"></ng-content>
      <ng-content suffix select="[suffix]"></ng-content>
    </input-validation-component>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsInputComponent }]
})
export class AtomsInputComponent extends BaseControlValueAccessorComponentModel<string | number | null | undefined> {
  @Input() canValidate = true;
  @Input() label = '';
  @Input() inputType: INPUT_TYPE = INPUT_TYPE.TEXT;
  @Input() autocomplete: Autocomplete = 'on';

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
}
