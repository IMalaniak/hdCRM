import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';

import { THEME_PALETTE, IFieldType, InputType } from '@/shared/constants';
import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';

@Component({
  selector: 'atoms-form-field',
  template: `
    <ng-container [ngSwitch]="fType" *ngIf="ngControl.control">
      <!-- INPUT -->
      <input-validation-component
        *ngSwitchDefault
        [label]="label"
        [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
        [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
      >
        <ng-content prefix select="[prefix]"></ng-content>
        <ng-content suffix select="[suffix]"></ng-content>
        <input matInput trimInput [type]="inputType" [formControl]="ngControl.control" />
      </input-validation-component>

      <!-- TEXTAREA -->
      <input-validation-component
        *ngSwitchCase="fieldTypes.TEXTAREA"
        [label]="label"
        [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
        [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
      >
        <textarea matInput trimInput [formControl]="ngControl.control" rows="5"></textarea>
      </input-validation-component>

      <!-- DATE -->
      <input-validation-component
        *ngSwitchCase="fieldTypes.DATE"
        [label]="label"
        [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
        [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
      >
        <mat-datepicker-toggle suffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker touchUi #picker></mat-datepicker>
        <input
          matInput
          trimInput
          [type]="inputTypes.DATETIME"
          [matDatepicker]="picker"
          [formControl]="ngControl.control"
          [value]="ngControl.control.value | dateTimeFormat | async"
        />
      </input-validation-component>

      <!-- SELECT -->
      <input-validation-component
        *ngSwitchCase="fieldTypes.SELECT"
        [label]="label"
        [canValidate]="(ngControl.control?.invalid || ngControl.control?.touched) && canValidate"
        [inputErrors]="ngControl.control?.invalid || ngControl.control?.touched ? ngControl.control?.errors : {}"
      >
        <mat-select [formControl]="ngControl.control">
          <mat-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-option>
        </mat-select>
      </input-validation-component>

      <!-- RADIOGROUP -->
      <ng-container *ngSwitchCase="fieldTypes.RADIOGROUP">
        <h5>{{ label }}</h5>
        <mat-radio-group
          [color]="color"
          [formControl]="ngControl.control"
          (change)="onFieldChange($event)"
          [ngClass]="{ 'd-flex flex-column': optionsColumn }"
        >
          <mat-radio-button *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-radio-button>
        </mat-radio-group>
      </ng-container>

      <!-- CHECKBOX -->
      <mat-checkbox
        [color]="color"
        *ngSwitchCase="fieldTypes.CHECKBOX"
        [formControl]="ngControl.control"
        (change)="onFieldChange($event)"
      >
        {{ label }}
      </mat-checkbox>
    </ng-container>
  `,
  styleUrls: ['./atoms-form-field.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsFormFieldComponent }]
})
export class AtomsFormFieldComponent extends BaseControlValueAccessorComponentModel<
  Date | string | number | boolean | null | undefined
> {
  @Input() options?: any;
  @Input() bindOptValue?: string;
  @Input() bindOptLabel?: string;
  @Input() color: ThemePalette = THEME_PALETTE.ACCENT;
  @Input() label: string;
  @Input() fType: IFieldType;
  @Input() optionsColumn = true;
  @Input() inputType: InputType = InputType.TEXT;
  @Input() canValidate = true;

  @Output() fieldChange: EventEmitter<MatRadioChange | MatSelectChange | MatCheckboxChange> = new EventEmitter();

  fieldTypes = IFieldType;
  inputTypes = InputType;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }

  onFieldChange(event: MatRadioChange | MatSelectChange | MatCheckboxChange): void {
    this.fieldChange.emit(event);
  }
}

// TODO: @IMalaniak:
// - add input types
// - check why date is not set for the firt time
