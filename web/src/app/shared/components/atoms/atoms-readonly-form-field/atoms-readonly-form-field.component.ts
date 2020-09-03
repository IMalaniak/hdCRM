import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IFieldType } from '@/shared/models/FieldType';

@Component({
  selector: 'atoms-readonly-form-field',
  template: `
    <div class="d-flex justify-content-between py-3">
      <span>{{ label }}:</span>

      <span *ngIf="checkIsDate()">{{ value | dateTimeFormat | async }}</span>
      <span *ngIf="!checkIsDate()">{{ value }}</span>
    </div>
    <mat-divider></mat-divider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsReadonlyFormFieldComponent {
  @Input() label: string;
  // TODO @IMalaniak change this to have a type
  @Input() value: any;
  @Input() fType: IFieldType;

  fieldTypes = IFieldType;

  checkIsDate(): boolean {
    return this.fType === this.fieldTypes.DATE;
  }
}
