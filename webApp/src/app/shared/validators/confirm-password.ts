import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    const newPassword = control.get('newPassword').value;

    const verifyPassword = control.get('verifyPassword').value;

    if (newPassword !== verifyPassword) {
      control.get('verifyPassword').setErrors({ ConfirmPassword: true });
    } else {
      return null;
    }
  }
}
