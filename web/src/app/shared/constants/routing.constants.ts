export class PathConstants {
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
  static DETAILS_ID = `${PathConstants.DETAILS}/${PathConstants.PARAMS_ID}`;

  // auth
  static AUTH = 'auth';
  static LOGIN = 'login';
  static ACTIVATE_ACCOUNT = 'activate-account';
  static ACTIVATE_ACCOUNT_TOKEN = `${PathConstants.ACTIVATE_ACCOUNT}/${PathConstants.PARAMS_TOKEN}`;
  static REQUEST_NEW_PASSWORD = 'request-new-password';
  static PASSWORD_RESET = 'password-reset';
  static PASSWORD_RESET_TOKEN = `${PathConstants.PASSWORD_RESET}/${PathConstants.PARAMS_TOKEN}`;
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

export class RoutingConstants {
  static BASE_URL = '/';

  // app
  static ROUTE_HOME = `${RoutingConstants.BASE_URL}`;
  static ROUTE_DASHBOARD = `${RoutingConstants.BASE_URL}${PathConstants.DASHBOARD}`;
  static ROUTE_INTERNAL_ERROR = `${RoutingConstants.BASE_URL}${PathConstants.INTERNAL_ERROR}`;

  // auth
  static ROUTE_AUTH = `${RoutingConstants.BASE_URL}${PathConstants.AUTH}`;
  static ROUTE_AUTH_LOGIN = `${RoutingConstants.ROUTE_AUTH}/${PathConstants.LOGIN}`;
  static ROUTE_AUTH_REGISTER = `${RoutingConstants.ROUTE_AUTH}/${PathConstants.REGISTER}`;
  static ROUTE_AUTH_REGISTER_SUCCESS = `${RoutingConstants.ROUTE_AUTH}/${PathConstants.REGISTER_SUCESS}`;
  static ROUTE_AUTH_REQUEST_NEW_PASSWORD = `${RoutingConstants.ROUTE_AUTH}/${PathConstants.REQUEST_NEW_PASSWORD}`;

  // users
  static ROUTE_USERS = `${RoutingConstants.BASE_URL}${PathConstants.USERS}`;
  static ROUTE_MY_PROFILE = `${RoutingConstants.ROUTE_USERS}/${PathConstants.MY_PROFILE}`;
  static ROUTE_USERS_DETAILS = `${RoutingConstants.ROUTE_USERS}/${PathConstants.DETAILS}`;

  // departments
  static ROUTE_DEPARTMENTS = `${RoutingConstants.BASE_URL}${PathConstants.DEPARTMENTS}`;
  static ROUTE_DEPARTMENTS_DETAILS = `${RoutingConstants.BASE_URL}${PathConstants.DEPARTMENTS}/${PathConstants.DETAILS}`;
  static ROUTE_DEPARTMENTS_ADD = `${RoutingConstants.BASE_URL}${PathConstants.DEPARTMENTS}/${PathConstants.ADD}`;

  // planner
  static ROUTE_PLANNER = `${RoutingConstants.BASE_URL}${PathConstants.PLANNER}`;
  static ROUTE_PLANNER_DETAILS = `${RoutingConstants.BASE_URL}${PathConstants.PLANNER}/${PathConstants.DETAILS}`;
  static ROUTE_PLANNER_ADD = `${RoutingConstants.BASE_URL}${PathConstants.PLANNER}/${PathConstants.ADD}`;

  // roles
  static ROUTE_ROLES = `${RoutingConstants.BASE_URL}${PathConstants.ROLES}`;
  static ROUTE_ROLES_DETAILS = `${RoutingConstants.BASE_URL}${PathConstants.ROLES}/${PathConstants.DETAILS}`;
  static ROUTE_ROLES_ADD = `${RoutingConstants.BASE_URL}${PathConstants.ROLES}/${PathConstants.ADD}`;
}

export class RoutingDataConstants {
  static FORM_NAME = 'formName';
  static FORM_JSON = 'formJSON';

  static DEPARTMENT = 'department';
  static ROLE = 'role';
}
