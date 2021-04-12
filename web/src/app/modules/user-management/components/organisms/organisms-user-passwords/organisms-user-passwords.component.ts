import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { IconsService } from '@/core/services';
import { changeOldPassword } from '@/core/modules/user-api/store';
import { NewPassword } from '@/shared/models';
import { ConfirmPasswordValidator } from '@/shared/validators';
import { ACTION_LABEL, BS_ICON, INPUT_TYPE } from '@/shared/constants';

@Component({
  selector: 'organisms-user-passwords',
  templateUrl: './organisms-user-passwords.component.html',
  styleUrls: ['./organisms-user-passwords.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserPasswordsComponent implements OnInit {
  @Input() isLoading: boolean;

  userNewPassword: FormGroup;
  inputTypes = INPUT_TYPE;
  actionLabels = ACTION_LABEL;
  icons: { [key: string]: BS_ICON } = {
    save: BS_ICON.ClipboardCheck,
    eye: BS_ICON.Eye,
    eyeDisabled: BS_ICON.EyeSlash
  };
  hidePassword = true;

  constructor(private store: Store<AppState>, private fb: FormBuilder, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.icons)]);
  }

  ngOnInit(): void {
    this.buildUserNewPassword();
  }

  buildUserNewPassword(): void {
    this.userNewPassword = this.fb.group(
      {
        oldPassword: new FormControl(null, Validators.required),
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
        verifyPassword: new FormControl(null, Validators.required),
        deleteSessions: new FormControl(true)
      },
      {
        validators: ConfirmPasswordValidator.matchPassword
      }
    );
  }

  changePassword(newPassword: NewPassword): void {
    this.userNewPassword.reset({ deleteSessions: true });
    this.store.dispatch(changeOldPassword({ newPassword }));
  }
}
