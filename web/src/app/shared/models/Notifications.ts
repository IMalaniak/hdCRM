import { NOTIFICATION_TYPES } from '../constants';

export interface Notification {
  id: string;
  description: string;
  type: NOTIFICATION_TYPES;
  read: boolean;
  date: Date;
}
