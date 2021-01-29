import { InputType } from '@/shared/constants';
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { BaseControlValueAccessorComponentModel } from '../../base';

@Component({
  selector: 'atoms-date',
  templateUrl: './atoms-date.component.html',
  styleUrls: ['./atoms-date.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsDateComponent }]
})
export class AtomsDateComponent extends BaseControlValueAccessorComponentModel<Date | null | undefined> {
  @Input() canValidate = true;
  @Input() label = '';

  inputType: typeof InputType = InputType;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
