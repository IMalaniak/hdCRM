import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFieldType } from '@/shared/models/FieldType';

@Component({
  selector: 'atoms-labeled-form-field',
  template: `
    <ng-container [ngSwitch]="fType">
      <mat-form-field *ngSwitchDefault class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input matInput [formControl]="control" />
      </mat-form-field>

      <mat-form-field *ngSwitchCase="fieldTypes.SELECT" class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <mat-select [formControl]="control">
          <mat-option *ngFor="let option of options" [value]="option.id">{{ option.keyString }}</mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `,
  styleUrls: ['./atoms-labeled-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsLabeledFormFieldComponent {
  @Input() options?: any;
  @Input() label: string;
  @Input() fType: IFieldType;
  @Input() control: FormControl;

  fieldTypes = IFieldType;
}
