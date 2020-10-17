import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { THEME_PALETTE, IFieldType } from '@/shared/constants';

@Component({
  selector: 'atoms-form-field',
  template: `
    <ng-container [ngSwitch]="fType">
      <mat-form-field *ngSwitchDefault class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input matInput [formControl]="control" />
      </mat-form-field>

      <mat-form-field *ngSwitchCase="fieldTypes.TEXTAREA" class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <textarea matInput [formControl]="control" rows="5"></textarea>
      </mat-form-field>

      <mat-form-field *ngSwitchCase="fieldTypes.DATE" class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          [formControl]="control"
          [value]="control.value | dateTimeFormat | async"
          type="datetime"
        />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker touchUi #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field *ngSwitchCase="fieldTypes.SELECT" class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <mat-select [formControl]="control">
          <mat-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</mat-option>
        </mat-select>
      </mat-form-field>

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

  @Output() fieldChange: EventEmitter<MatRadioChange | MatSelectChange | MatCheckboxChange> = new EventEmitter();

  fieldTypes = IFieldType;

  onFieldChange(event: MatRadioChange | MatSelectChange | MatCheckboxChange): void {
    this.fieldChange.emit(event);
  }
}

// TODO: @IMalaniak:
// - add input types
// - check why date is not set for the firt time
// - apply two way binding
