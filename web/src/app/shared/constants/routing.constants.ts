export class PATHS {
  // app
  static DASHBOARD = 'dashboard';
  static INTERNAL_ERROR = 'server-error';

  static PATH_MATCH_FULL = 'full';
  static PATH_MATCH_PREFIX = 'prefix';

  // common
  static LIST = 'list';
  static DETAILS = 'details';
  static ADD = 'add';
  static PARAMS_TOKEN = ':token';
  static PARAMS_ID = ':id';
  static DETAILS_ID = `${PATHS.DETAILS}/${PATHS.PARAMS_ID}`;

  // auth
  static AUTH = 'auth';
  static LOGIN = 'login';
  static ACTIVATE_ACCOUNT = 'activate-account';
  static ACTIVATE_ACCOUNT_TOKEN = `${PATHS.ACTIVATE_ACCOUNT}/${PATHS.PARAMS_TOKEN}`;
  static REQUEST_NEW_PASSWORD = 'request-new-password';
  static PASSWORD_RESET = 'password-reset';
  static PASSWORD_RESET_TOKEN = `${PATHS.PASSWORD_RESET}/${PATHS.PARAMS_TOKEN}`;
  static REGISTER = 'register';
  static REGISTER_SUCESS = 'register-success';

  // departments
  static DEPARTMENTS = 'departments';

  // planner
  static PLANNER = 'planner';
  static STAGES = 'stages';

  // users
  static USERS = 'users';
  static MY_PROFILE = 'myprofile';

  // roles
  static ROLES = 'roles';
}

export class ROUTING {
  static BASE_URL = '/';

  // app
  static ROUTE_HOME = `${ROUTING.BASE_URL}`;
  static ROUTE_DASHBOARD = `${ROUTING.BASE_URL}${PATHS.DASHBOARD}`;
  static ROUTE_INTERNAL_ERROR = `${ROUTING.BASE_URL}${PATHS.INTERNAL_ERROR}`;

  // auth
  static ROUTE_AUTH = `${ROUTING.BASE_URL}${PATHS.AUTH}`;
  static ROUTE_AUTH_LOGIN = `${ROUTING.ROUTE_AUTH}/${PATHS.LOGIN}`;
  static ROUTE_AUTH_REGISTER = `${ROUTING.ROUTE_AUTH}/${PATHS.REGISTER}`;
  static ROUTE_AUTH_REGISTER_SUCCESS = `${ROUTING.ROUTE_AUTH}/${PATHS.REGISTER_SUCESS}`;
  static ROUTE_AUTH_REQUEST_NEW_PASSWORD = `${ROUTING.ROUTE_AUTH}/${PATHS.REQUEST_NEW_PASSWORD}`;

  // users
  static ROUTE_USERS = `${ROUTING.BASE_URL}${PATHS.USERS}`;
  static ROUTE_MY_PROFILE = `${ROUTING.ROUTE_USERS}/${PATHS.MY_PROFILE}`;
  static ROUTE_USERS_DETAILS = `${ROUTING.ROUTE_USERS}/${PATHS.DETAILS}`;

  // departments
  static ROUTE_DEPARTMENTS = `${ROUTING.BASE_URL}${PATHS.DEPARTMENTS}`;
  static ROUTE_DEPARTMENTS_DETAILS = `${ROUTING.BASE_URL}${PATHS.DEPARTMENTS}/${PATHS.DETAILS}`;
  static ROUTE_DEPARTMENTS_ADD = `${ROUTING.BASE_URL}${PATHS.DEPARTMENTS}/${PATHS.ADD}`;

  // planner
  static ROUTE_PLANNER = `${ROUTING.BASE_URL}${PATHS.PLANNER}`;
  static ROUTE_PLANNER_DETAILS = `${ROUTING.BASE_URL}${PATHS.PLANNER}/${PATHS.DETAILS}`;
  static ROUTE_PLANNER_ADD = `${ROUTING.BASE_URL}${PATHS.PLANNER}/${PATHS.ADD}`;

  // roles
  static ROUTE_ROLES = `${ROUTING.BASE_URL}${PATHS.ROLES}`;
  static ROUTE_ROLES_DETAILS = `${ROUTING.BASE_URL}${PATHS.ROLES}/${PATHS.DETAILS}`;
  static ROUTE_ROLES_ADD = `${ROUTING.BASE_URL}${PATHS.ROLES}/${PATHS.ADD}`;
}

export class ROUTING_DATA {
  static FORM_NAME = 'formName';
  static FORM_JSON = 'formJSON';

  static DEPARTMENT = 'department';
  static ROLE = 'role';
}
