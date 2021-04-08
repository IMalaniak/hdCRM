import { NOTIFICATION_TYPE } from '../constants';

export interface Notification {
  id: string;
  description: string;
  type: NOTIFICATION_TYPE;
  read: boolean;
  date: Date;
}
