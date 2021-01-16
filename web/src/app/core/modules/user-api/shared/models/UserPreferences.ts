import { Preferences } from '@/core/store/preferences';

export interface UserPreferences extends Preferences {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
}
