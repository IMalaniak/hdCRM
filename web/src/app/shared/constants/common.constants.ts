export class CONSTANTS {
  static NO_CONTENT_INFO = 'No content';

  // no image
  static NO_IMAGE_URL = './assets/images/userpic/noimage_croped.png';
  static NO_IMAGE_TITLE = 'noimage';

  // regex
  static PHONE_REGEX: RegExp = /^[0-9]+$/;
  static LOGIN_REGEX: RegExp = /^[a-zA-Z0-9]+$/;
  static WWW_REGEX: RegExp = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  static ONLY_TEXT_REGEX: RegExp = /^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;

  // texts
  static TEXTS_PRIVILEGE_GUARD_ERROR = 'Sorry, You have no rights to see this page!';
  static TEXTS_SHOW_SIDEBAR = 'Show side panel';
  static TEXTS_HIDE_SIDEBAR = 'Hide side panel';
  static TEXTS_THEME_DARK = 'Dark theme';
  static TEXTS_THEME_LIGHT = 'Light theme';
  static TEXTS_CREATE_DEPARTMENT = 'Create department';
  static TEXTS_UPDATE_DEPARTMENT_CONFIRM = 'Are you sure you want to update department details?';
  static TEXTS_DELETE_DEPARTMENT_CONFIRM = 'Do you really want to delete department? You will not be able to recover!';
  static TEXTS_CREATE_PLAN = 'Create plan';
  static TEXTS_UPDATE_PLAN_CONFIRM = 'Are you sure you want to update plan details?';
  static TEXTS_DELETE_PLAN_CONFIRM = 'Do you really want to delete plan? You will not be able to recover!';
  static TEXTS_CREATE_ROLE = 'Create role';
  static TEXTS_UPDATE_ROLE_CONFIRM = 'Are you sure you want to update role details?';
  static TEXTS_DELETE_ROLE_CONFIRM = 'Do you really want to delete role? You will not be able to recover!';
  static TEXTS_UPDATE_USER_CONFIRM = 'Are you sure you want to update user details?';
  static TEXTS_DELETE_USER_CONFIRM = 'Do you really want to delete user? You will not be able to recover!';
  static TEXTS_DELETE_TASKS_COMPLETED_CONFIRM = 'Do you really want to delete all comleted tasks?';
  static TEXTS_UPDATE_COMMON_CONFIRM = 'Do you really want to save changes? You will not be able to recover this!';
  static TEXTS_SESSION_DEACTIVATE_CONFIRM =
    'Do you really want to deactivate this session? You will not be able to recover this!';
  static TEXTS_SESSION_DEACTIVATE_ALL_CONFIRM =
    'Do you really want to deactivate all other active sessions? Current session will stay active!';
  static TEXTS_DELETE_PLAN_DOCUMENT = 'Are you sure you want to delete document from plan, changes cannot be undone?';
  static TEXTS_YOU_ARE_NOT_AUTHORIZED = 'You are not authorized to see this page, or your session has been expired!';
  static TEXTS_GOOGLE_DRIVE_INTEGRATION_ENABLED = 'Google Drive integration is enabled!';
  static TEXTS_GOOGLE_DRIVE_INTEGRATION_DISABLED = 'Google Drive integration is disabled!';

  // TODO: dialog text
  static TEXTS_MORE_DETAILS = 'More details';
  static TEXTS_INVITE_USERS = 'Invite users';
  static TEXTS_SEND_INVITATIONS = 'Send invitations';
  static TEXTS_CREATE_TASK = 'Create task';
  static TEXTS_CREATE_PRIVILEGE = 'Create privilege';
  static TEXTS_CREATE_STAGE = 'Create stage';
  static TEXTS_SELECT_MANAGER = 'Select manager';
  static TEXTS_SELECT_USERS = 'Select users';
  static TEXTS_SELECT_WORKERS = 'Select workers';
  static TEXTS_SELECT_PARTICIPANS = 'Select participants';
  static TEXTS_SELECT_PRIVILEGES = 'Select privileges';
  static TEXTS_UPDATE_TASK = 'Update task';
}
