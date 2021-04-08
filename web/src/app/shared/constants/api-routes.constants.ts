export class API_ROUTES {
  // users
  static USERS = '/users';
  static USERS_INVITE = `${API_ROUTES.USERS}/invite`;
  static UPDATE_USER_STATE = `${API_ROUTES.USERS}/updateUserState`;
  static USERS_CHANGE_STATE_OF_SELECTED = `${API_ROUTES.USERS}/changeStateOfSelected`;
  static USERS_CHANGE_PASSWORD = `${API_ROUTES.USERS}/change-password`;
  static USERS_PROFILE = `${API_ROUTES.USERS}/profile`;
  static USERS_ORGANIZATION = `${API_ROUTES.USERS}/org`;
  static USERS_SESSION = `${API_ROUTES.USERS}/session`;
  static USERS_MULTIPLE_SESSION = `${API_ROUTES.USERS}/session-multiple`;

  // states
  static STATES = '/states';

  // auth
  static AUTH = '/auth';
  static AUTH_REGISTER = `${API_ROUTES.AUTH}/register`;
  static AUTHENTICATE = `${API_ROUTES.AUTH}/authenticate`;
  static REFRESH_SESSION = `${API_ROUTES.AUTH}/refresh-session`;
  static ACTIVATE_ACCOUNT = `${API_ROUTES.AUTH}/activate_account`;
  static FORGOT_PASSWORD = `${API_ROUTES.AUTH}/forgot_password`;
  static RESET_PASSWORD = `${API_ROUTES.AUTH}/reset_password`;
  static LOGOUT = `${API_ROUTES.AUTH}/logout`;

  // forms
  static FORMS = '/forms';

  // preferences
  static PREFERENCES = '/preferences';

  // departments
  static DEPARTMENTS = '/departments';
  static DEPARTMENTS_DASHBOARD = `${API_ROUTES.DEPARTMENTS}/dashboard`;

  // plans
  static PLANS = '/plans';
  static PLANS_DOCUMENTS = `${API_ROUTES.PLANS}/documents`;

  // stages
  static STAGES = '/stages';

  // privileges
  static PRIVILEGES = '/privileges';

  // roles
  static ROLES = '/roles';
  static ROLES_DASHBOARD = `${API_ROUTES.ROLES}/dashboard`;

  // tasks
  static TASKS = '/tasks';
  static TASKS_PRIORITIES = '/task-priorities';
  static TASKS_MULTIPLE = `${API_ROUTES.TASKS}/task-multiple`;
}
