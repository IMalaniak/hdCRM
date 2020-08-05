import { Component, Input, HostBinding, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AtomsFormFieldComponent } from '../../atoms';

@Component({
  selector: 'molecules-form-field',
  template: `
    <atoms-form-field
      *ngIf="editForm && editable"
      [label]="label"
      [options]="options"
      [bindOptLabel]="bindOptLabel"
      [bindOptValue]="bindOptValue"
      [control]="control"
      [fType]="fType"
    ></atoms-form-field>
    <atoms-readonly-form-field *ngIf="!editForm" [label]="label" [value]="value"></atoms-readonly-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesFormFieldComponent extends AtomsFormFieldComponent implements OnInit {
  // @IMalaniak use genericType for value and for options
  @Input() value: any;
  @Input() editForm = false;
  @Input() editable = true;

  @HostBinding('class.w-100') fullWidth = true;

  ngOnInit(): void {
    if (this.control) {
      this.value = this.control.value;
    }
  }
}
