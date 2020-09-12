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
  static TEXTS_UPDATE_DEPARTMENT_CONFIRM = 'Are you sure you want to update department details?';
  static TEXTS_DELETE_DEPARTMENT_CONFIRM = 'Do you really want to delete department? You will not be able to recover!';
  static TEXTS_UPDATE_PLAN_CONFIRM = 'Are you sure you want to update plan details?';
  static TEXTS_DELETE_PLAN_CONFIRM = 'Do you really want to delete plan? You will not be able to recover!';
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
}
