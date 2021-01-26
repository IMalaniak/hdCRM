import { User } from '@/core/modules/user-api/shared';
import { STYLECONSTANTS, THEME_PALETTE } from '@/shared/constants';
import { Navigation } from '@/shared/utils/';
import { CellType } from './cellType.enum';

export interface ICell {
  readonly cellType: CellType;
  readonly value?: any;
  readonly customClass?: string;
  readonly navigation?: Navigation;
}
export class Cell {
  static createSequenceCell(): ICell {
    return {
      cellType: CellType.Sequence
    };
  }

  static createStringCell(value: string | number, customClass?: string): ICell {
    return value ? { value, cellType: CellType.String, customClass } : this.createEmptyCell();
  }

  static createLinkCell(value: string, navigation: Navigation): ICell {
    return value
      ? { value, cellType: CellType.Navigation, navigation }
      : this.createEmptyCell(STYLECONSTANTS.PL_HEADER_LINK);
  }

  static createBooleanIconCell(value: boolean, disabledColor = false): ICell {
    return {
      value,
      cellType: CellType.Icon,
      customClass: !disabledColor ? (value ? THEME_PALETTE.ACCENT : THEME_PALETTE.WARN) : ''
    };
  }

  static createCheckboxCell(value = false): ICell {
    return { value, cellType: CellType.Checkbox };
  }

  static createAvatarCell(value: User): ICell {
    return { value, cellType: CellType.Avatar };
  }

  static createDateCell(value: Date): ICell {
    return { value, cellType: CellType.Date };
  }

  static createEmptyCell(customClass = ''): ICell {
    return { value: '-', cellType: CellType.String, customClass };
  }

  static createActionsCell(): ICell {
    return { cellType: CellType.Actions };
  }
}
