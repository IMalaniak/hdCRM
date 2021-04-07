import { NOTIFICATION_TYPES } from '../constants';
import { BaseMessage } from './baseMessage';

export interface ToastMessage extends BaseMessage {
  type: NOTIFICATION_TYPES;
}
