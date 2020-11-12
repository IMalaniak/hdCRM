import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { delay, skipUntil, takeUntil } from 'rxjs/operators';

import { ACTION_LABELS, CONSTANTS, DIALOG, RoutingDataConstants, THEME_PALETTE } from '@/shared/constants';
import { Asset, DynamicForm } from '@/shared/models';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { Plan } from '@/modules/planner/models';
import { User, UsersDialogComponent } from '@/modules/users';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'templates-plan-view',
  templateUrl: './templates-plan-view.component.html',
  styleUrls: ['./templates-plan-view.component.scss']
})
export class TemplatesPlanViewComponent implements OnInit, OnDestroy {
  @Input() plan: Plan;
  @Input() editForm: boolean;
  @Input() canEdit: boolean;
  @Input() canAddAttachment: boolean;
  @Input() canDeleteAttachment: boolean;
  @Input() isCreatePage: boolean;

  @Output() isEditing: EventEmitter<boolean> = new EventEmitter();
  @Output() saveChanges: EventEmitter<Plan> = new EventEmitter();
  @Output() deleteDocument: EventEmitter<any> = new EventEmitter();

  planFormJson: DynamicForm;
  planFormValues: Plan;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private toastMessageService: ToastMessageService,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.planFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
  }

  onClickEdit(): void {
    this.isEditing.emit(true);
  }

  onClickCancelEdit(): void {
    this.isEditing.emit(false);
  }

  planFormValueChanges(formVal: Plan): void {
    this.planFormValues = { ...this.planFormValues, ...formVal };
  }

  removeParticipant(userId: number): void {
    this.plan = {
      ...this.plan,
      Participants: this.plan.Participants.filter((participant) => participant.id !== userId)
    };
  }

  updatePlan(): void {
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_UPDATE_PLAN_CONFIRM).then((result) => {
      if (result.value) {
        this.savePlan();
      }
    });
  }

  savePlan(): void {
    this.saveChanges.emit({ ...this.plan, ...this.planFormValues });
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
          .filter((user) => this.plan.Participants.some((participant) => participant.id === user.id))
          ?.forEach((selectedParticipant) => {
            userC.selection.select(selectedParticipant);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedParticipants: User[] = result?.filter(
          (selectedParticipant) => !this.plan.Participants.some((user) => user.id === selectedParticipant.id)
        );

        if (selectedParticipants?.length) {
          this.plan.Participants = [...this.plan.Participants, ...selectedParticipants];
          this.cdr.detectChanges();
        }
      });
  }

  addDocument(doc: Asset): void {
    this.plan = { ...this.plan, Documents: [...this.plan.Documents, doc] };
    // this.store$.dispatch(updatePlanRequested({ plan: this.plan }));
  }

  deleteDoc(docId: number): void {
    // TODO: @IMalaniak, @ArseniiIrod remake this in feature
    this.toastMessageService
      .confirm(DIALOG.CONFIRM, 'Are you sure you want to delete document from plan, changes cannot be undone?')
      .then((result) => {
        if (result.value) {
          const req = {
            planId: this.plan.id,
            docId: docId
          };
          this.deleteDocument.emit(req);
        }
      });
  }

  cardTitle(): string {
    return this.isCreatePage ? 'Create plan' : this.plan.title;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
