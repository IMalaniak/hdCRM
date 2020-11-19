import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { Asset, DialogDataModel, DialogResultModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { TemplatesViewDetailsComponent } from '@/shared/components/templates';
import { DialogService } from '@/shared/services';
import { CONSTANTS } from '@/shared/constants';
import { Plan } from '@/modules/planner/models';
import { User, UsersDialogComponent } from '@/modules/users';

@Component({
  selector: 'templates-plan-view',
  templateUrl: './templates-plan-view.component.html',
  styleUrls: ['./templates-plan-view.component.scss']
})
export class TemplatesPlanViewComponent extends TemplatesViewDetailsComponent<Plan> implements OnDestroy {
  @Input() canAddAttachment: boolean;
  @Input() canDeleteAttachment: boolean;

  // TODO: @IMalaniak implement deleting document
  // @Output() deleteDocument: EventEmitter<any> = new EventEmitter();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    protected store$: Store<AppState>,
    protected dialogService: DialogService,
    private cdr: ChangeDetectorRef
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
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PARTICIPANS)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          const selectedParticipants: User[] = result.model.filter(
            (selectedParticipant) => !this.item.Participants.some((user) => user.id === selectedParticipant.id)
          );
          if (selectedParticipants?.length) {
            this.item.Participants = [...this.item.Participants, ...selectedParticipants];
            this.cdr.detectChanges();
          }
        }
      });

    // TODO: @ArsenIrod add afterOpened logic
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
    return this.isCreatePage ? CONSTANTS.TEXTS_CREATE_PLAN : this.item.title;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
