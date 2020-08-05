import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFieldType } from '@/shared/models/FieldType';

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
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsFormFieldComponent {
  @Input() options?: any;
  @Input() bindOptValue?: string;
  @Input() bindOptLabel?: string;
  @Input() label: string;
  @Input() fType: IFieldType;
  @Input() control: FormControl;

  fieldTypes = IFieldType;
}
