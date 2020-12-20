import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AppState } from '@/core/store';
import { formRequested, selectFormByName } from '@/core/store/dynamic-form';
import { ACTION_LABELS, CONSTANTS, THEME_PALETTE } from '@/shared/constants';
import { DialogConfirmModel, DialogDataModel, DynamicForm } from '@/shared/models';
import { DialogService } from '@/shared/services';
import { DialogConfirmComponent } from '@/shared/components/dialogs';

@Component({
  selector: 'templates-view-details',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(protected store$: Store<AppState>, protected dialogService: DialogService) {}

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
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => {
      this.save();
    });
  }

  save(): void {
    this.saveChanges.emit({ ...this.item, ...this.formValues });
  }
}
