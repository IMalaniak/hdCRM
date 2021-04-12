import { BS_ICON } from '@/shared/constants/icon.enum';

import { ROW_ACTION_TYPE } from './row-action-type.enum';

export interface RowActionData<A extends ROW_ACTION_TYPE> {
  actionType: A;
  id?: number;
  ids?: number[];
}

export interface RowAction<A extends ROW_ACTION_TYPE> {
  icon?: BS_ICON;
  label?: string;
  data?: RowActionData<A>;
}
