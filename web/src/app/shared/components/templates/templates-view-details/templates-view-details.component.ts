import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { ACTION_LABELS, CONSTANTS, THEME_PALETTE } from '@/shared/constants';
import { DialogConfirmModel, DialogDataModel } from '@/shared/models';
import { DialogService } from '@/shared/services';
import { DialogConfirmComponent } from '@/shared/components/dialogs';
import { DynamicFormPageModel } from '../../dynamic-form/models/dynamic-form-page.model';

@Component({
  selector: 'templates-view-details',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesViewDetailsComponent<T> extends DynamicFormPageModel<T> implements OnDestroy {
  @Input() item: T;
  @Input() editForm: boolean;
  @Input() canEdit: boolean;
  @Input() isCreatePage: boolean;

  @Output() isEditing: EventEmitter<boolean> = new EventEmitter();
  @Output() saveChanges: EventEmitter<T> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  protected unsubscribe: Subject<void> = new Subject();
  protected formName = '';

  constructor(protected readonly store$: Store<AppState>, protected readonly dialogService: DialogService) {
    super(store$);
  }

  onClickEdit(): void {
    this.isEditing.emit(true);
  }

  onClickCancelEdit(): void {
    this.isEditing.emit(false);
  }

  update(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_COMMON_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => {
      this.save();
    });
  }

  save(): void {
    this.saveChanges.emit({ ...this.item, ...this.getFormValues() });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
