export interface PasswordReset {
  newPassword: string;
  verifyPassword: string;
  oldPassword: string;
  deleteSessions?: boolean;
}

// eslint-disable-next-line no-redeclare
export interface PasswordReset {
  token?: string;
}
