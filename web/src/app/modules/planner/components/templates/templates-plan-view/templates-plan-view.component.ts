import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { delay, skipUntil, takeUntil } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { Asset } from '@/shared/models';
import { TemplatesViewDetailsComponent } from '@/shared/components/templates';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
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

  // @Output() deleteDocument: EventEmitter<any> = new EventEmitter();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    protected store$: Store<AppState>,
    protected toastMessageService: ToastMessageService,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {
    super(store$, toastMessageService);
  }

  removeParticipant(userId: number): void {
    this.item = {
      ...this.item,
      Participants: this.item.Participants.filter((participant) => participant.id !== userId)
    };
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select participants'
      }
    });

    const userC = dialogRef.componentInstance.usersComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
      .subscribe(() => {
        userC.users
          .filter((user) => this.item.Participants.some((participant) => participant.id === user.id))
          ?.forEach((selectedParticipant) => {
            userC.selection.select(selectedParticipant);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedParticipants: User[] = result?.filter(
          (selectedParticipant) => !this.item.Participants.some((user) => user.id === selectedParticipant.id)
        );

        if (selectedParticipants?.length) {
          this.item.Participants = [...this.item.Participants, ...selectedParticipants];
          this.cdr.detectChanges();
        }
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
    return this.isCreatePage ? 'Create plan' : this.item.title;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
