import { NOTIFICATION_TYPES } from '../constants';

export interface Notification {
  id: number;
  description: string;
  type: NOTIFICATION_TYPES;
  read: boolean;
  date: Date;
}
