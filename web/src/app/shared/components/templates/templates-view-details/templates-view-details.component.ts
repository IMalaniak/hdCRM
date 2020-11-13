import { AppState } from '@/core/reducers';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { ACTION_LABELS, CONSTANTS, DIALOG, THEME_PALETTE } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { ToastMessageService } from '@/shared/services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'templates-view-details',
  template: ''
})
export class TemplatesViewDetailsComponent<T> implements OnInit {
  @Input() item: T;
  @Input() formName: string;
  @Input() editForm: boolean;
  @Input() canEdit: boolean;
  @Input() isCreatePage: boolean;

  @Output() isEditing: EventEmitter<boolean> = new EventEmitter();
  @Output() saveChanges: EventEmitter<T> = new EventEmitter();

  formJson$: Observable<DynamicForm>;
  formValues: T;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(protected store$: Store<AppState>, protected toastMessageService: ToastMessageService) {}

  ngOnInit(): void {
    this.formJson$ = this.store$.pipe(
      select(selectFormByName(this.formName)),
      tap((form) => {
        if (!form) {
          this.store$.dispatch(formRequested({ formName: this.formName }));
        }
      }),
      filter((form) => !!form)
    );
  }

  onClickEdit(): void {
    this.isEditing.emit(true);
  }

  onClickCancelEdit(): void {
    this.isEditing.emit(false);
  }

  formValueChanges(formVal: T): void {
    this.formValues = { ...this.formValues, ...formVal };
  }

  update(): void {
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM).then((result) => {
      if (result.value) {
        this.save();
      }
    });
  }

  save(): void {
    this.saveChanges.emit({ ...this.item, ...this.formValues });
  }
}
