export class PATHS {
  // app
  static HOME = 'home';
  static DASHBOARD = 'dashboard';
  static INTERNAL_ERROR = 'server-error';

  // common
  static LIST = 'list';
  static DETAILS = 'details';
  static ADD = 'add';

  // auth
  static AUTH = 'auth';
  static LOGIN = 'login';
  static ACTIVATE_ACCOUNT = 'activate-account';
  static REQUEST_NEW_PASSWORD = 'request-new-password';
  static PASSWORD_RESET = 'password-reset';
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

export class RouteConstants {
  static BASE_URL = '/';

  // app
  static ROUTE_HOME = `${RouteConstants.BASE_URL}${PATHS.HOME}`;
  static ROUTE_DASHBOARD = `${RouteConstants.BASE_URL}${PATHS.DASHBOARD}`;
  static ROUTE_INTERNAL_ERROR = `${RouteConstants.BASE_URL}${PATHS.INTERNAL_ERROR}`;

  // auth
  static ROUTE_AUTH = `${RouteConstants.BASE_URL}${PATHS.AUTH}`;
  static ROUTE_AUTH_LOGIN = `${RouteConstants.ROUTE_AUTH}/${PATHS.LOGIN}`;
  static ROUTE_AUTH_REGISTER = `${RouteConstants.ROUTE_AUTH}/${PATHS.REGISTER}`;
  static ROUTE_AUTH_REGISTER_SUCCESS = `${RouteConstants.ROUTE_AUTH}/${PATHS.REGISTER_SUCESS}`;
  static ROUTE_AUTH_REQUEST_NEW_PASSWORD = `${RouteConstants.ROUTE_AUTH}/${PATHS.REQUEST_NEW_PASSWORD}`;

  // users
  static ROUTE_USERS = `${RouteConstants.BASE_URL}${PATHS.USERS}`;
  static ROUTE_MY_PROFILE = `${RouteConstants.ROUTE_USERS}/${PATHS.MY_PROFILE}`;
  static ROUTE_USERS_DETAILS = `${RouteConstants.ROUTE_USERS}/${PATHS.DETAILS}`;

  // departments
  static ROUTE_DEPARTMENTS = `${RouteConstants.BASE_URL}${PATHS.DEPARTMENTS}`;
  static ROUTE_DEPARTMENTS_DETAILS = `${RouteConstants.BASE_URL}${PATHS.DEPARTMENTS}/${PATHS.DETAILS}`;
  static ROUTE_DEPARTMENTS_ADD = `${RouteConstants.BASE_URL}${PATHS.DEPARTMENTS}/${PATHS.ADD}`;

  // planner
  static ROUTE_PLANNER = `${RouteConstants.BASE_URL}${PATHS.PLANNER}`;
  static ROUTE_PLANNER_DETAILS = `${RouteConstants.BASE_URL}${PATHS.PLANNER}/${PATHS.DETAILS}`;
  static ROUTE_PLANNER_ADD = `${RouteConstants.BASE_URL}${PATHS.PLANNER}/${PATHS.ADD}`;

  // roles
  static ROUTE_ROLES = `${RouteConstants.BASE_URL}${PATHS.ROLES}`;
  static ROUTE_ROLES_DETAILS = `${RouteConstants.BASE_URL}${PATHS.ROLES}/${PATHS.DETAILS}`;
  static ROUTE_ROLES_ADD = `${RouteConstants.BASE_URL}${PATHS.ROLES}/${PATHS.ADD}`;
}
