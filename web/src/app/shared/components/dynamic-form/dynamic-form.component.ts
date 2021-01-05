import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicForm } from '@/shared/models';
import { DynamicFormService } from '@/core/services/dynamic-form.service';

@Component({
  selector: 'dynamic-form',
  template: `
    <form class="d-flex flex-column" [formGroup]="form" *ngIf="formJson">
      <molecules-form-field
        *ngFor="let field of formJson.form"
        [formControl]="form.get(field.controlName)"
        [label]="field.label"
        [color]="field.color"
        [options]="field.options"
        [fType]="field.type"
        [editable]="field.isEditable"
        [editOnly]="field.editOnly"
        [editForm]="editForm"
      ></molecules-form-field>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnChanges {
  @Input() data: any;
  @Input() formJson: DynamicForm;
  @Input() editForm: boolean;

  form: FormGroup;

  constructor(private readonly dynamicFormService: DynamicFormService) {}

  ngOnChanges(): void {
    if (this.formJson && this.data) {
      this.form = this.dynamicFormService.generateFormGroupFrom(this.formJson, this.data);
    }
  }
}
