export class ApiRoutesConstants {
  // users
  static USERS = '/users';
  static USERS_INVITE = `${ApiRoutesConstants.USERS}/invite`;
  static UPDATE_USER_STATE = `${ApiRoutesConstants.USERS}/updateUserState`;
  static USERS_CHANGE_STATE_OF_SELECTED = `${ApiRoutesConstants.USERS}/changeStateOfSelected`;
  static USERS_CHANGE_PASSWORD = `${ApiRoutesConstants.USERS}/change-password`;
  static USERS_PROFILE = `${ApiRoutesConstants.USERS}/profile`;
  static USERS_ORGANIZATION = `${ApiRoutesConstants.USERS}/org`;
  static USERS_SESSION = `${ApiRoutesConstants.USERS}/session`;
  static USERS_MULTIPLE_SESSION = `${ApiRoutesConstants.USERS}/session-multiple`;

  // states
  static STATES = '/states';

  // auth
  static AUTH = '/auth';
  static AUTH_REGISTER = `${ApiRoutesConstants.AUTH}/register`;
  static AUTHENTICATE = `${ApiRoutesConstants.AUTH}/authenticate`;
  static OAUTH_GOOGLE = `${ApiRoutesConstants.AUTH}/google`;
  static REFRESH_SESSION = `${ApiRoutesConstants.AUTH}/refresh-session`;
  static ACTIVATE_ACCOUNT = `${ApiRoutesConstants.AUTH}/activate_account`;
  static FORGOT_PASSWORD = `${ApiRoutesConstants.AUTH}/forgot_password`;
  static RESET_PASSWORD = `${ApiRoutesConstants.AUTH}/reset_password`;
  static LOGOUT = `${ApiRoutesConstants.AUTH}/logout`;

  // forms
  static FORMS = '/forms';

  // preferences
  static PREFERENCES = '/preferences';

  // departments
  static DEPARTMENTS = '/departments';
  static DEPARTMENTS_DASHBOARD = `${ApiRoutesConstants.DEPARTMENTS}/dashboard`;

  // plans
  static PLANS = '/plans';
  static PLANS_DOCUMENTS = `${ApiRoutesConstants.PLANS}/documents`;

  // stages
  static STAGES = '/stages';
  static STAGES_DASHBOARD = `${ApiRoutesConstants.STAGES}/dashboard`;

  // privileges
  static PRIVILEGES = '/privileges';

  // roles
  static ROLES = '/roles';
  static ROLES_DASHBOARD = `${ApiRoutesConstants.ROLES}/dashboard`;

  // tasks
  static TASKS = '/tasks';
  static TASKS_PRIORITIES = '/task-priorities';
  static TASKS_MULTIPLE = `${ApiRoutesConstants.TASKS}/task-multiple`;
}
