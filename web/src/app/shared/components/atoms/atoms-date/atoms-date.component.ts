import { Component, Input, Optional, Self } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';
import { INPUT_TYPE } from '@/shared/constants';

@Component({
  selector: 'atoms-date',
  templateUrl: './atoms-date.component.html',
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsDateComponent }]
})
export class AtomsDateComponent extends BaseControlValueAccessorComponentModel<Date | null | undefined> {
  @Input() canValidate = true;
  @Input() label = '';

  inputType: typeof INPUT_TYPE = INPUT_TYPE;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
