export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

export enum DIALOG {
  CONFIRM = 'Are You sure?',
  OK = 'OK',
  CANCEL = 'Cancel',
  YES = 'Yes',
  NO = 'No'
}

export enum ALERT {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question'
}

export enum COLUMN_NAMES {
  ICON = 'icon',
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ACTIONS = 'actions',
  PHONE = 'phone',
  MANAGER = 'manager',
  WORKERS = 'workers',
  CREATOR = 'creator',
  STAGE = 'stage',
  PARTICIPANTS = 'participants',
  DEADLINE = 'deadline',
  SELECT = 'select',
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  USERS = 'users',
  PRIVILEGES = 'privileges',
  KEY = 'key',
  AVATAR = 'avatar',
  LOGIN = 'login',
  EMAIL = 'email',
  NAME = 'name',
  SURNAME = 'surname',
  DEPARTMENT = 'dep',
  STATE = 'state',
  TYPE = 'type'
}

export enum TAB_NAMES {
  DETAILS = 'details',
  ORGANIZATION = 'org',
  PASSWORD = 'password',
  SESSIONS = 'sessions',
  PREFERENCES = 'preferences',
  INTEGRATIONS = 'integrations'
}

export const NO_IMAGE = './assets/images/userpic/noimage_croped.png';
export const NO_IMAGE_TITLE = 'noimage';

export const PHONE_REGEX: RegExp = /^[0-9]+$/;
export const LOGIN_REGEX: RegExp = /^[a-zA-Z0-9]+$/;
export const WWW_REGEX: RegExp = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const ONLY_TEXT_REGEX: RegExp = /^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
