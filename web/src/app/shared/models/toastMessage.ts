import { NOTIFICATION_TYPE } from '../constants';
import { BaseMessage } from './baseMessage';

export interface ToastMessage extends BaseMessage {
  type: NOTIFICATION_TYPE;
}
