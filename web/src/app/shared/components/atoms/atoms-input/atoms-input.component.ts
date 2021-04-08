import { Component, Input, Optional, Self } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';
import { INPUT_TYPE } from '@/shared/constants';

@Component({
  selector: 'atoms-input',
  template: `
    <input-validation-component
      [label]="label"
      [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
      [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
    >
      <input matInput trimInput [type]="inputType" [formControl]="ngControl.control" />
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
  @Input() autocomplete: 'on' | 'off' = 'on'; // TODO: investigate the universal method to control autocomplete, the autocomplete don't work

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
