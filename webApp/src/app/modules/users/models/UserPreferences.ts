import { IDateFormat, ITimeFormat, IItemsPerPage, IListView } from '@/shared/models';

export interface UserPreferences {
  id: number;
  dateFormat: IDateFormat;
  timeFormat: ITimeFormat;
  itemsPerPage: IItemsPerPage;
  listView: IListView;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
}
