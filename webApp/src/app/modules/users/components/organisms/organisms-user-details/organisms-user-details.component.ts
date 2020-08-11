import { Component, Input, EventEmitter, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User, State } from '@/modules/users';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastMessageService } from '@/shared';

@Component({
  selector: 'organisms-user-details',
  templateUrl: './organisms-user-details.component.html',
  styleUrls: ['./organisms-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() states: State[];
  @Input() canEdit = false;
  @Input() editForm: boolean;

  @Output() updateUser: EventEmitter<User> = new EventEmitter();
  @Output() setEditableForm: EventEmitter<boolean> = new EventEmitter();

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private toastMessageService: ToastMessageService) {}

  ngOnInit(): void {
    this.buildUserFormGroup();
  }

  buildUserFormGroup(): void {
    this.userForm = this.fb.group({
      name: new FormControl(this.user.name),
      surname: new FormControl(this.user.surname),
      email: new FormControl(this.user.email),
      phone: new FormControl(this.user.phone),
      StateId: new FormControl(this.user.StateId)
    });
  }

  onClickEdit(): void {
    this.setEditableForm.emit(true);
  }

  onClickCancelEdit(): void {
    this.setEditableForm.emit(false);
  }

  onUpdateUserSubmit(): void {
    this.toastMessageService
      .confirm('Are you sure?', 'Do you really want to save changes? You will not be able to recover this!')
      .then(result => {
        if (result.value) {
          this.updateUser.emit({ ...this.user, ...this.userForm.value });
        }
      });
  }
}
