import { Component, Input, HostBinding, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFieldType } from '@/shared/models/FieldType';

@Component({
  selector: 'molecules-form-field',
  template: `
    <atoms-labeled-form-field
      *ngIf="editForm && editable"
      [label]="label"
      [options]="options"
      [control]="control"
      [fType]="fType"
    ></atoms-labeled-form-field>
    <atoms-readonly-labeled-form-field
      *ngIf="!editForm"
      [label]="label"
      [value]="value"
    ></atoms-readonly-labeled-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesFormFieldComponent implements OnInit {
  // @IMalaniak use genericType for value and for options
  @Input() fType: IFieldType = IFieldType.INPUT;
  @Input() options?: any;
  @Input() label: string;
  @Input() control: FormControl;
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
