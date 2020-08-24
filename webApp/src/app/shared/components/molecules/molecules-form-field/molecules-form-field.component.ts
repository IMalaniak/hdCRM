import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { AtomsFormFieldComponent } from '../../atoms';

@Component({
  selector: 'molecules-form-field',
  template: `
    <atoms-form-field
      *ngIf="editForm && editable"
      [label]="label"
      [color]="color"
      [options]="options"
      [bindOptLabel]="bindOptLabel"
      [bindOptValue]="bindOptValue"
      [control]="control"
      [fType]="fType"
      (fieldChange)="onFieldChange($event)"
    ></atoms-form-field>
    <atoms-readonly-form-field *ngIf="!editForm" [label]="label" [value]="value"></atoms-readonly-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesFormFieldComponent extends AtomsFormFieldComponent {
  // @IMalaniak use genericType for value and for options
  @Input() value: any;
  @Input() editForm = false;
  @Input() editable = true;

  @HostBinding('class.w-100') fullWidth = true;
}
