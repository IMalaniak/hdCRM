import { User } from '@/core/modules/user-api/shared';
import { THEME_PALETTE } from '@/shared/constants';
import { Navigation } from '@/shared/utils/';
import { CellType } from './cellType.enum';

export class CellValue {
  constructor(
    readonly value: any,
    readonly cellType: CellType,
    readonly customClass?: string,
    readonly navigation?: Navigation
  ) {}

  static createSequenceCell(): CellValue {
    return new CellValue(undefined, CellType.Sequence);
  }

  static createStringCell(value: string | number, customClass?: string): CellValue {
    return value ? new CellValue(value, CellType.String, customClass) : this.createEmptyCell();
  }

  static createLinkCell(value: string, navigation: Navigation): CellValue {
    return value ? new CellValue(value, CellType.Navigation, undefined, navigation) : this.createEmptyCell();
  }

  static createBooleanIconCell(value: boolean, disabledColor = false): CellValue {
    return new CellValue(
      value,
      CellType.Icon,
      !disabledColor ? (value ? THEME_PALETTE.ACCENT : THEME_PALETTE.WARN) : ''
    );
  }

  // TODO: in separate task make checkbox to work
  // static createCheckboxCell(action: CellActionType, value = false): CellValue {
  //   let cell: CellValue = new CellValue(value, CellType.Checkbox);
  //   return (cell = { ...cell, cellAction: action });
  // }

  static createAvatarCell(value: User): CellValue {
    return new CellValue(value, CellType.Avatar);
  }

  static createDateCell(value: Date): CellValue {
    return new CellValue(value, CellType.Date);
  }

  static createEmptyCell(): CellValue {
    return new CellValue('-', CellType.String);
  }

  static createActionsCell(): CellValue {
    return new CellValue(undefined, CellType.Actions);
  }
}
