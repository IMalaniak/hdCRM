export class APIS {
  // users
  static USERS = '/users';
  static USERS_INVITE = `${APIS.USERS}/invite`;
  static UPDATE_USER_STATE = `${APIS.USERS}/updateUserState`;
  static USERS_CHANGE_STATE_OF_SELECTED = `${APIS.USERS}/changeStateOfSelected`;
  static USERS_CHANGE_PASSWORD = `${APIS.USERS}/change-password`;
  static USERS_PROFILE = `${APIS.USERS}/profile`;
  static USERS_ORGANIZATION = `${APIS.USERS}/org`;
  static USERS_SESSION = `${APIS.USERS}/session`;
  static USERS_MULTIPLE_SESSION = `${APIS.USERS}/session-multiple`;

  // states
  static STATES = '/states';

  // auth
  static AUTH = '/auth';
  static AUTH_REGISTER = `${APIS.AUTH}/register`;
  static AUTHENTICATE = `${APIS.AUTH}/authenticate`;
  static REFRESH_SESSION = `${APIS.AUTH}/refresh-session`;
  static ACTIVATE_ACCOUNT = `${APIS.AUTH}/activate_account`;
  static FORGOT_PASSWORD = `${APIS.AUTH}/forgot_password`;
  static RESET_PASSWORD = `${APIS.AUTH}/reset_password`;
  static LOGOUT = `${APIS.AUTH}/logout`;

  // forms
  static FORMS = '/forms';

  // preferences
  static PREFERENCES = '/preferences';

  // departments
  static DEPARTMENTS = '/departments';
  static DEPARTMENTS_DASHBOARD = `${APIS.DEPARTMENTS}/dashboard`;

  // plans
  static PLANS = '/plans';
  static PLANS_DOCUMENTS = `${APIS.PLANS}/documents`;

  // stages
  static STAGES = '/stages';

  // privileges
  static PRIVILEGES = '/privileges';

  // roles
  static ROLES = '/roles';
  static ROLES_DASHBOARD = `${APIS.ROLES}/dashboard`;

  // tasks
  static TASKS = '/tasks';
  static TASKS_PRIORITIES = '/task-priorities';
  static TASKS_MULTIPLE = `${APIS.TASKS}/task-multiple`;
}
