export interface NewPassword {
  token?: string;
  oldPassword?: string;
  newPassword: string;
  verifyPassword: string;
}
