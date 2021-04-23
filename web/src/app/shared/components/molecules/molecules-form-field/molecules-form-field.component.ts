import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  Optional,
  Self,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatRadioChange } from '@angular/material/radio';

import { FIELD_TYPE, THEME_PALETTE } from '@shared/constants';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'molecules-form-field',
  templateUrl: 'molecules-form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: MoleculesFormFieldComponent }]
})
export class MoleculesFormFieldComponent extends BaseControlValueAccessorComponentModel<
  string | number | boolean | Date | null | undefined | any[]
> {
  @Input() fType: FIELD_TYPE;
  @Input() label = '';
  @Input() editForm = false;
  @Input() editable = true;
  @Input() editOnly?: boolean;
  @Input() options?: any[];
  @Input() color: ThemePalette = THEME_PALETTE.PRIMARY;
  @Input() bindOptValue?: string; // TODO: provide logic to use this parameter
  @Input() bindOptLabel?: string; // TODO: provide logic to use this parameter

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange: EventEmitter<MatCheckboxChange | MatRadioChange> = new EventEmitter();

  @HostBinding('class.w-100') fullWidth = true;

  fieldTypes: typeof FIELD_TYPE = FIELD_TYPE;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  onValueChange(event: MatCheckboxChange | MatRadioChange): void {
    this.onChange.emit(event);
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
}
