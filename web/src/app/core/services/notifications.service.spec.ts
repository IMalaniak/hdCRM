import { NOTIFICATION_TYPES } from '@/shared/constants';
import { DateUtilityService } from '@/shared/services';
import { Notification } from '@/shared/models';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let localStorageServiceSpy: {
    getObject: jasmine.Spy;
    setObjectKeyValue: jasmine.Spy;
  };

  const notificationLocalStorage = {
    list: [
      {
        id: '1',
        description: 'Test description',
        type: NOTIFICATION_TYPES.WARN,
        read: false,
        date: new Date('2020-12-14T11:04:06.317Z')
      },
      {
        id: '2',
        description: 'Test 2 description',
        type: NOTIFICATION_TYPES.INFO,
        read: true,
        date: new Date('2020-12-14T11:04:06.317Z')
      }
    ],
    ignoreList: {
      passwordExpire: new Date('2020-12-10T11:04:06.317Z')
    }
  };

  beforeEach(() => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getObject', 'setObjectKeyValue']);
    localStorageServiceSpy.getObject.and.returnValue(notificationLocalStorage);
    service = new NotificationsService(localStorageServiceSpy as any, new DateUtilityService());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return notification list', () => {
    expect(service.getList()).toEqual(notificationLocalStorage.list);
  });

  it('should return ignore list', () => {
    expect(service.getIgnoreList()).toEqual(notificationLocalStorage.ignoreList);
  });

  it('should create a notification', () => {
    const expected: Partial<Notification> = {
      description: 'New notification',
      type: NOTIFICATION_TYPES.INFO,
      read: false
    };

    expect(service.create('New notification', NOTIFICATION_TYPES.INFO)).toEqual(jasmine.objectContaining(expected));
  });

  it('should mark notification as read', () => {
    service.markAsRead('1');
    expect(localStorageServiceSpy.setObjectKeyValue).toHaveBeenCalledOnceWith('notifications', 'list', [
      {
        id: '1',
        description: 'Test description',
        type: NOTIFICATION_TYPES.WARN,
        read: true,
        date: new Date('2020-12-14T11:04:06.317Z')
      },
      {
        id: '2',
        description: 'Test 2 description',
        type: NOTIFICATION_TYPES.INFO,
        read: true,
        date: new Date('2020-12-14T11:04:06.317Z')
      }
    ]);
  });

  it('should remove notification', () => {
    service.remove('1');
    expect(localStorageServiceSpy.setObjectKeyValue).toHaveBeenCalledOnceWith('notifications', 'list', [
      {
        id: '2',
        description: 'Test 2 description',
        type: NOTIFICATION_TYPES.INFO,
        read: true,
        date: new Date('2020-12-14T11:04:06.317Z')
      }
    ]);
  });

  it('should set a new ignore notification', () => {
    const newIgnore = { ['newIgnore']: new Date('2020-12-14T11:04:06.317Z') };
    service.ignore(newIgnore);
    expect(localStorageServiceSpy.setObjectKeyValue).toHaveBeenCalledOnceWith('notifications', 'ignoreList', {
      ...notificationLocalStorage.ignoreList,
      ...newIgnore
    });
  });

  it('should check ignore', () => {
    expect(service.checkIgnore('passwordExpire')).toBeFalse();
    expect(service.checkIgnore('not-exist')).toBeFalse();
  });
});
