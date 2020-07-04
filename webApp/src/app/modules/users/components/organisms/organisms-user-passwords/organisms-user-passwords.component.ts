import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiResponse, NewPassword } from '@/shared/models';
import { ConfirmPasswordValidator } from '@/shared/validators';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { changeOldPassword } from '@/modules/users/store/user.actions';

@Component({
  selector: 'organisms-user-passwords',
  templateUrl: './organisms-user-passwords.component.html',
  styleUrls: ['./organisms-user-passwords.component.scss']
})
export class OrganismsUserPasswordsComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input()
  set serverResponse(serverResponse: ApiResponse) {
    if (serverResponse) {
      this.serverResp = serverResponse;
      setTimeout(() => {
        this.serverResp = null;
      }, 5000);
    }
  }

  userNewPassword: FormGroup;
  serverResp: ApiResponse;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildUserNewPassword();
  }

  buildUserNewPassword(): void {
    this.userNewPassword = this.fb.group(
      {
        oldPassword: new FormControl(null, Validators.required),
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
        verifyPassword: new FormControl(null, Validators.required)
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  changePassword(newPassword: NewPassword): void {
    this.userNewPassword.reset();
    this.store.dispatch(changeOldPassword({ newPassword }));
  }
}
