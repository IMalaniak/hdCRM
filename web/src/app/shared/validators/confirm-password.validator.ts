import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ConfirmPasswordValidator {
  static matchPassword(control: AbstractControl): ValidationErrors | null {
    if (control) {
      const newPasswordControll = control.get('newPassword');
      const verifyPasswordControll = control.get('verifyPassword');

      const newPassword = newPasswordControll.value;
      const verifyPassword = verifyPasswordControll.value;

      if (newPassword !== verifyPassword) {
        verifyPasswordControll.setErrors({ ConfirmPassword: true });
        return { ConfirmPassword: true };
      } else {
        return null;
      }
    }
    return null;
  }
}
