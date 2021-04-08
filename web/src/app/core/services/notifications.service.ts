import { Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { DateUtilityService, LocalStorageService } from '@/shared/services';
import { Notification } from '@/shared/models';
import { NOTIFICATION_TYPE } from '@/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private key = 'notifications';
  private list = 'list';
  private ignoreList = 'ignoreList';

  constructor(private readonly localStorage: LocalStorageService, private readonly dateUtility: DateUtilityService) {}

  getList(): Notification[] {
    return this.localStorage.getObject(this.key)?.list || [];
  }

  getIgnoreList(): { [key: string]: Date } {
    return this.localStorage.getObject(this.key)?.ignoreList || {};
  }

  create(description: string, type: NOTIFICATION_TYPE): Notification {
    const notification: Notification = {
      description,
      date: new Date(),
      read: false,
      type,
      id: uuidv4()
    };

    const list = this.getList();
    this.localStorage.setObjectKeyValue(this.key, this.list, [...list, notification]);
    return notification;
  }

  markAsRead(id: string): void {
    const list = this.getList();
    const notification = list.find((nItem) => nItem.id === id);
    if (notification) {
      const index = list.indexOf(notification);
      list[index] = { ...list[index], read: true };
      return this.localStorage.setObjectKeyValue(this.key, this.list, list);
    }
  }

  remove(id: string): void {
    const list = this.getList();
    return this.localStorage.setObjectKeyValue(
      this.key,
      this.list,
      list.filter((notification: Notification) => notification.id !== id)
    );
  }

  ignore(ignore: { [key: string]: Date }): void {
    const ignoreList = this.getIgnoreList();
    return this.localStorage.setObjectKeyValue(this.key, this.ignoreList, { ...ignoreList, ...ignore });
  }

  checkIgnore(key: string): boolean {
    const ignoreList = this.getIgnoreList();
    if (ignoreList[key]) {
      return this.dateUtility.diffDaysFromToday(ignoreList[key]) > 0;
    }
    return false;
  }
}
