import { BS_ICONS } from '@/shared/constants/icons.enum';
import { RowActionType } from './rowActionType.enum';

export interface RowActionData<A extends RowActionType> {
  actionType: A;
  id?: number;
}

export interface RowAction<A extends RowActionType> {
  icon?: BS_ICONS;
  label?: string;
  data?: RowActionData<A>;
}
