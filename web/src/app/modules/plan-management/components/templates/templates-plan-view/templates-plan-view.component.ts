import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Plan } from '@core/modules/plan-api/shared';
import { selectPlansLoading } from '@core/modules/plan-api/store/plan';
import { selectUsersById } from '@core/modules/user-api/store';
import { AppState } from '@core/store';
import { UsersDialogComponent } from '@modules/user-management/components';
import { prepareSelectionPopup, resetSelectionPopup } from '@modules/user-management/store';
import { TemplatesViewDetailsComponent } from '@shared/components/templates';
import { CommonConstants, FormNameConstants } from '@shared/constants';
import { Asset, DialogDataModel, IDialogResult, DIALOG_TYPE, DialogWithTwoButtonModel } from '@shared/models';
import { DialogService } from '@shared/services';

@Component({
  selector: 'templates-plan-view',
  templateUrl: './templates-plan-view.component.html',
  styleUrls: ['./templates-plan-view.component.scss']
})
export class TemplatesPlanViewComponent extends TemplatesViewDetailsComponent<Plan> {
  @Input() canAddAttachment: boolean;
  @Input() canDeleteAttachment: boolean;

  isLoading$: Observable<boolean> = this.store$.pipe(select(selectPlansLoading));

  // TODO: @IMalaniak implement deleting document
  // @Output() deleteDocument: EventEmitter<any> = new EventEmitter();

  protected readonly formName = FormNameConstants.PLAN;

  constructor(
    protected readonly store$: Store<AppState>,
    protected readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store$, dialogService);
  }

  removeParticipant(userId: number): void {
    this.item = {
      ...this.item,
      Participants: this.item.Participants.filter((participant) => participant.id !== userId)
    };
  }

  addParticipantDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel()
    };
    this.store$.dispatch(prepareSelectionPopup({ selectedUsersIds: this.item.Participants.map((user) => user.id) }));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DIALOG_TYPE.MAX)
      .afterClosed()
      .subscribe((result: IDialogResult<number[]>) => {
        if (result?.success) {
          const selectedParticipantsIds: number[] = result.data?.filter(
            (selectedUserId) => !this.item.Participants.some((user) => user.id === selectedUserId)
          );
          if (selectedParticipantsIds?.length) {
            this.store$.pipe(select(selectUsersById(selectedParticipantsIds)), first()).subscribe((selectedUsers) => {
              this.item = {
                ...this.item,
                Participants: [...this.item.Participants, ...selectedUsers]
              };
              this.cdr.detectChanges();
            });
          }
        }
        this.store$.dispatch(resetSelectionPopup());
      });
  }

  addDocument(doc: Asset): void {
    this.item = { ...this.item, Documents: [...this.item.Documents, doc] };
    this.saveChanges.emit(this.item);
  }

  deleteDoc(_: number): void {
    // TODO: @IMalaniak, @ArseniiIrod remake this in feature
    // this.toastMessageService
    //   .confirm(DIALOG.CONFIRM, 'Are you sure you want to delete document from plan, changes cannot be undone?')
    //   .then((result) => {
    //     if (result.value) {
    //       const req = {
    //         planId: this.item.id,
    //         docId: docId
    //       };
    //       this.deleteDocument.emit(req);
    //     }
    //   });
  }

  cardTitle(): string {
    return this.isCreatePage ? CommonConstants.TEXTS_CREATE_PLAN : this.item.title;
  }
}
