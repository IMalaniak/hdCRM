import { BS_ICON } from '@/shared/constants/icon.enum';
import { RowActionType } from './rowActionType.enum';

export interface RowActionData<A extends RowActionType> {
  actionType: A;
  id?: number;
  ids?: number[];
}

export interface RowAction<A extends RowActionType> {
  icon?: BS_ICON;
  label?: string;
  data?: RowActionData<A>;
}
