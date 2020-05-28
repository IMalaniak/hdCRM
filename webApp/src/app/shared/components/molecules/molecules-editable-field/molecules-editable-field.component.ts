import { Component, Input, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'molecules-editable-field',
  template: `
    <atoms-labeled-form-field *ngIf="editForm" [label]="label" [control]="data" [fType]="fType"></atoms-labeled-form-field>
    <atoms-readonly-labeled-form-field
      *ngIf="!editForm"
      [label]="label"
      [data]="data.value"
    ></atoms-readonly-labeled-form-field>
  `,
  styleUrls: ['./molecules-editable-field.component.scss']
})
export class MoleculesEditableFieldComponent {
  @Input() label: string;
  @Input() fType: string;
  @Input() data: FormControl;
  @Input() editForm = false;

  @HostBinding('class.w-100') fullWidth = true;
}
