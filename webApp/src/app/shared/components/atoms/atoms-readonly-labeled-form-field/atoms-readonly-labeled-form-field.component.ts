import { Component, Input } from '@angular/core';

@Component({
  selector: 'atoms-readonly-labeled-form-field',
  template: `
    <div class="d-flex justify-content-between py-3">
      <span>{{ label }}:</span>

      <span>{{ data }}</span>
    </div>
    <mat-divider></mat-divider>
  `,
  styleUrls: ['./atoms-readonly-labeled-form-field.component.scss']
})
export class AtomsReadonlyLabeledFormFieldComponent {
  @Input() label: string;
  @Input() data: string;

}
