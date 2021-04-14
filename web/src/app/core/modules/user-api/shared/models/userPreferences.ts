import { Preferences } from '@core/store/preferences';
import { TimeStamps } from '@shared/models/base';

export interface UserPreferences extends Preferences, TimeStamps {
  id: number;
  UserId: number;
}
