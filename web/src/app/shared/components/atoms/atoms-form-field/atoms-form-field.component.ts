import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';

import { THEME_PALETTE, IFieldType, InputType } from '@/shared/constants';

@Component({
  selector: 'atoms-form-field',
  template: `
    <ng-container [ngSwitch]="fType">
      <!-- INPUT -->
      <input-validation-component
        *ngSwitchDefault
        [label]="label"
        [canValidate]="control?.touched && canValidate"
        [inputErrors]="control?.touched ? control?.errors : {}"
      >
        <ng-content prefix select="[prefix]"></ng-content>
        <ng-content suffix select="[suffix]"></ng-content>
        <input matInput [type]="inputType" [formControl]="control" />
      </input-validation-component>

      <!-- TEXTAREA -->
      <input-validation-component *ngSwitchCase="fieldTypes.TEXTAREA" [label]="label">
        <textarea matInput [formControl]="control" rows="5"></textarea>
      </input-validation-component>

      <!-- DATE -->
      <input-validation-component
        *ngSwitchCase="fieldTypes.DATE"
        [label]="label"
        [canValidate]="control?.touched && canValidate"
        [inputErrors]="control?.touched ? control?.errors : {}"
      >
        <mat-datepicker-toggle suffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker touchUi #picker></mat-datepicker>
        <input
          matInput
          [type]="inputTypes.DATETIME"
          [matDatepicker]="picker"
          [formControl]="control"
          [value]="control.value | dateTimeFormat | async"
        />
      </input-validation-component>

      <!-- SELECT -->
      <input-validation-component
        *ngSwitchCase="fieldTypes.SELECT"
        [label]="label"
        [canValidate]="control?.touched && canValidate"
        [inputErrors]="control?.touched ? control?.errors : {}"
      >
        <mat-select [formControl]="control" required>
          <mat-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-option>
        </mat-select>
      </input-validation-component>

      <!-- RADIOGROUP -->
      <ng-container *ngSwitchCase="fieldTypes.RADIOGROUP">
        <h5>{{ label }}</h5>
        <mat-radio-group
          [color]="color"
          [formControl]="control"
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
        [formControl]="control"
        (change)="onFieldChange($event)"
      >
        {{ label }}
      </mat-checkbox>
    </ng-container>
  `,
  styleUrls: ['./atoms-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsFormFieldComponent {
  @Input() options?: any;
  @Input() bindOptValue?: string;
  @Input() bindOptLabel?: string;
  @Input() color: ThemePalette = THEME_PALETTE.ACCENT;
  @Input() label: string;
  @Input() fType: IFieldType;
  @Input() control: FormControl;
  @Input() optionsColumn = true;
  @Input() inputType: InputType = InputType.TEXT;
  @Input() canValidate = true;

  @Output() fieldChange: EventEmitter<MatRadioChange | MatSelectChange | MatCheckboxChange> = new EventEmitter();

  fieldTypes = IFieldType;
  inputTypes = InputType;

  onFieldChange(event: MatRadioChange | MatSelectChange | MatCheckboxChange): void {
    this.fieldChange.emit(event);
  }
}

// TODO: @IMalaniak:
// - add input types
// - check why date is not set for the firt time
// - apply two way binding
