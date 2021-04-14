import { BelongsToOrganization, User } from '@core/modules/user-api/shared';
import { TimeStamps } from '@shared/models/base';

import { Privilege } from './privilege';

export interface Role extends TimeStamps, BelongsToOrganization {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  selected?: boolean;
}
