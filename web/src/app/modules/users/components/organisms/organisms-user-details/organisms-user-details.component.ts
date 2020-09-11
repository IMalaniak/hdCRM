import { Component, Input, EventEmitter, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { User } from '@/modules/users';
import { ToastMessageService } from '@/shared/services';
import { DynamicForm } from '@/shared/models';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { DIALOG } from '@/shared/constants';

@Component({
  selector: 'organisms-user-details',
  templateUrl: './organisms-user-details.component.html',
  styleUrls: ['./organisms-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() canEdit = false;
  @Input() editForm: boolean;

  @Output() updateUser: EventEmitter<User> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  userFormValues: User;

  userFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('user')));

  constructor(private toastMessageService: ToastMessageService, private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'user' }));
  }

  userFormValueChanges(formVal: User): void {
    this.userFormValues = { ...this.userFormValues, ...formVal };
  }

  onClickEdit(): void {
    this.setEditableForm.emit(true);
  }

  onClickCancelEdit(): void {
    this.setEditableForm.emit(false);
    // this.userForm.reset(this.user);
  }

  onUpdateUserSubmit(): void {
    this.toastMessageService
      .confirm(DIALOG.CONFIRM, 'Do you really want to save changes? You will not be able to recover this!')
      .then((result) => {
        if (result.value) {
          this.updateUser.emit({ ...this.user, ...this.userFormValues });
        }
      });
  }
}
