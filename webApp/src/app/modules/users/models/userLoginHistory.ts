export interface UserLoginHistory {
  id: number;
  IP: string;
  dateLastLoggedIn: Date;
  dateUnsuccessfulLogIn: Date;
  UserId: number;
}
