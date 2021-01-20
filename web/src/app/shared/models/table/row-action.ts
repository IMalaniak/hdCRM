import { BS_ICONS } from '@/shared/constants/icons.enum';
import { RowActionType } from './rowActionType.enum';

export interface RowActionData<A extends RowActionType, I> {
  actionType: A;
  item?: I;
}

export interface RowAction<A extends RowActionType, I> {
  icon: BS_ICONS;
  label: string;
  data?: RowActionData<A, I>;
}
