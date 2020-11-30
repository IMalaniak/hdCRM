import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { IconsService } from '@/core/services';
import { NewPassword } from '@/shared/models';
import { ConfirmPasswordValidator } from '@/shared/validators';
import { IFieldType, ACTION_LABELS, BS_ICONS, InputType } from '@/shared/constants';
import { changeOldPassword } from '@/modules/users/store/user.actions';

@Component({
  selector: 'organisms-user-passwords',
  templateUrl: './organisms-user-passwords.component.html',
  styleUrls: ['./organisms-user-passwords.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserPasswordsComponent implements OnInit {
  @Input() isLoading: boolean;

  userNewPassword: FormGroup;
  fieldTypes = IFieldType;
  inputTypes = InputType;
  actionLabels = ACTION_LABELS;
  icons: { [key: string]: BS_ICONS } = {
    save: BS_ICONS.ClipboardCheck,
    eye: BS_ICONS.Eye,
    eyeDisabled: BS_ICONS.EyeSlash
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
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  changePassword(newPassword: NewPassword): void {
    this.userNewPassword.reset({ deleteSessions: true });
    this.store.dispatch(changeOldPassword({ newPassword }));
  }
}
