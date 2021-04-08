import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FIELD_TYPE } from '@/shared/constants';

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
  @Input() fType: FIELD_TYPE;

  fieldTypes = FIELD_TYPE;

  checkIsDate(): boolean {
    return this.fType === this.fieldTypes.DATE;
  }
}
