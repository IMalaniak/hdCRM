import { User } from '@/core/modules/user-api/shared';
import { STYLE, THEME_PALETTE } from '@/shared/constants';
import { Navigation } from '../navigation';
import { CELL_TYPE } from './cell-type.enum';

export interface ICell {
  readonly cellType: CELL_TYPE;
  readonly value?: any;
  readonly customClass?: string;
  readonly navigation?: Navigation;
}

export class Cell {
  static createSequenceCell(): ICell {
    return {
      cellType: CELL_TYPE.Sequence
    };
  }

  static createStringCell(value: string | number, customClass?: string): ICell {
    return value ? { value, cellType: CELL_TYPE.String, ...(customClass && { customClass }) } : this.createEmptyCell();
  }

  static createLinkCell(value: string, navigation: Navigation): ICell {
    return value ? { value, cellType: CELL_TYPE.Navigation, navigation } : this.createEmptyCell(STYLE.PL_HEADER_LINK);
  }

  static createBooleanIconCell(value: boolean, disabledColor = false): ICell {
    return {
      value,
      cellType: CELL_TYPE.Icon,
      customClass: !disabledColor ? (value ? THEME_PALETTE.ACCENT : THEME_PALETTE.WARN) : ''
    };
  }

  static createCheckboxCell(value = false): ICell {
    return { value, cellType: CELL_TYPE.Checkbox };
  }

  static createAvatarCell(value: User): ICell {
    return { value, cellType: CELL_TYPE.Avatar };
  }

  static createDateCell(value: Date): ICell {
    return { value, cellType: CELL_TYPE.Date };
  }

  static createEmptyCell(customClass?: string): ICell {
    return { value: '-', cellType: CELL_TYPE.String, ...(customClass && { customClass }) };
  }

  static createActionsCell(): ICell {
    return { cellType: CELL_TYPE.Actions };
  }
}
