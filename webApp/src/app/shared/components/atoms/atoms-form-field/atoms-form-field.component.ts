import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFieldType } from '@/shared/models/FieldType';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'atoms-form-field',
  template: `
    <ng-container [ngSwitch]="fType">
      <mat-form-field *ngSwitchDefault class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input matInput [formControl]="control" />
      </mat-form-field>

      <mat-form-field *ngSwitchCase="fieldTypes.SELECT" class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <mat-select [formControl]="control">
          <mat-option *ngFor="let option of options" [value]="option[bindOptValue]">{{
            option[bindOptLabel]
          }}</mat-option>
        </mat-select>
      </mat-form-field>

      <ng-container *ngSwitchCase="fieldTypes.RADIOGROUP">
        <h5>{{ label }}</h5>
        <mat-radio-group
          [formControl]="control"
          (change)="onFieldChange($event)"
          [ngClass]="{ 'd-flex flex-column': optionsColumn }"
        >
          <mat-radio-button *ngFor="let option of options" [value]="option[bindOptValue]">{{
            option[bindOptLabel]
          }}</mat-radio-button>
        </mat-radio-group>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./atoms-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsFormFieldComponent {
  @Input() options?: any;
  @Input() bindOptValue?: string;
  @Input() bindOptLabel?: string;
  @Input() label: string;
  @Input() fType: IFieldType;
  @Input() control: FormControl;
  @Input() optionsColumn = true;

  @Output() fieldChange: EventEmitter<MatRadioChange | MatSelectChange | MatCheckboxChange> = new EventEmitter();

  fieldTypes = IFieldType;

  onFieldChange(event: MatRadioChange | MatSelectChange | MatCheckboxChange) {
    this.fieldChange.emit(event);
  }
}
