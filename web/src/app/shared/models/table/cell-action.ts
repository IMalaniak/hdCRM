import { CellActionType } from './cellActionType.enum';
import { BS_ICONS } from '@/shared/constants/icons.enum';

export interface CellAction {
  type: CellActionType;
  icon: BS_ICONS;
  message: string;
}
