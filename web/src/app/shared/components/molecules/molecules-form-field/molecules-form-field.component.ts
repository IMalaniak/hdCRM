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
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';
import { FIELD_TYPE, THEME_PALETTE } from '@/shared/constants';

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

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<MatCheckboxChange | MatRadioChange> = new EventEmitter();

  @HostBinding('class.w-100') fullWidth = true;

  fieldTypes: typeof FIELD_TYPE = FIELD_TYPE;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  protected onValueChange(event: MatCheckboxChange | MatRadioChange): void {
    this.onChange.emit(event);
  }
}
