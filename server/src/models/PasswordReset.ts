export interface PasswordReset {
  newPassword: string;
  verifyPassword: string;
  oldPassword: string;
  deleteSessions: boolean;
}

export interface PasswordReset {
  token: string;
}
