import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'atoms-readonly-labeled-form-field',
  template: `
    <div class="d-flex justify-content-between py-3">
      <span>{{ label }}:</span>

      <span>{{ value }}</span>
    </div>
    <mat-divider></mat-divider>
  `,
  styleUrls: ['./atoms-readonly-labeled-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsReadonlyLabeledFormFieldComponent {
  @Input() label: string;
  @Input() value: string;
}
