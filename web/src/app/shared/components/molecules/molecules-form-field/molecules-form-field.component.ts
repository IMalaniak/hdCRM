import { Component, Input, HostBinding, ChangeDetectionStrategy, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

import { AtomsFormFieldComponent } from '../../atoms';

@Component({
  selector: 'molecules-form-field',
  template: `
    <atoms-form-field
      *ngIf="editForm && editable"
      [formControl]="ngControl.control"
      [label]="label"
      [color]="color"
      [options]="options"
      [bindOptLabel]="bindOptLabel"
      [bindOptValue]="bindOptValue"
      [fType]="fType"
      (fieldChange)="onFieldChange($event)"
    ></atoms-form-field>

    <atoms-readonly-form-field
      *ngIf="!editForm && !editOnly"
      [label]="label"
      [value]="value"
      [fType]="fType"
    ></atoms-readonly-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: MoleculesFormFieldComponent }]
})
export class MoleculesFormFieldComponent extends AtomsFormFieldComponent {
  @Input() editForm = false;
  @Input() editable = true;
  @Input() editOnly?: boolean;

  @HostBinding('class.w-100') fullWidth = true;

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super(ngControl);

    this.ngControl.valueAccessor = this;
  }
}
