import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'atoms-readonly-form-field',
  template: `
    <div class="d-flex justify-content-between py-3">
      <span>{{ label }}:</span>

      <span>{{ value }}</span>
    </div>
    <mat-divider></mat-divider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsReadonlyFormFieldComponent {
  @Input() label: string;
  @Input() value: string;
}
