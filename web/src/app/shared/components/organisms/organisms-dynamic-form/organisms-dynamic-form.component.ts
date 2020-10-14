import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { DynamicFormService } from '@/core/services/dynamic-form.service';
import { FormGroup } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DynamicForm } from '@/shared/models';

@Component({
  selector: 'organisms-dynamic-form',
  template: `
    <form class="d-flex flex-column" [formGroup]="form" *ngIf="formJson">
      <molecules-form-field
        *ngFor="let field of formJson.form"
        [label]="field.label"
        [color]="field.color"
        [options]="field.options"
        [control]="form.get(field.controlName)"
        [fType]="field.type"
        [value]="data[field.controlName] || null"
        [editable]="field.isEditable"
        [editOnly]="field.editOnly"
        [editForm]="editForm"
      ></molecules-form-field>
    </form>
  `,
  styleUrls: ['./organisms-dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsDynamicFormComponent implements OnChanges, OnDestroy {
  // TODO change this to have a type
  @Input() data: any;
  @Input() formValues: any;
  @Input() formJson: DynamicForm;
  @Input() editForm: boolean;

  // TODO change this to have a type same as data
  @Output() formChanges: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formJson']?.currentValue) {
      this.form = this.dynamicFormService.generateFormGroupFrom(this.formJson, this.data);
      this.form.valueChanges.pipe(takeUntil(this.unsubscribe), debounceTime(300)).subscribe((values) => {
        this.formValues = values;
        return this.formChanges.emit(values);
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
