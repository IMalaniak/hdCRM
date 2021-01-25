import { User } from '@/core/modules/user-api/shared';
import { STYLECONSTANTS, THEME_PALETTE } from '@/shared/constants';
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
    return value
      ? new CellValue(value, CellType.Navigation, undefined, navigation)
      : this.createEmptyCell(STYLECONSTANTS.PL_HEADER_LINK);
  }

  static createBooleanIconCell(value: boolean, disabledColor = false): CellValue {
    return new CellValue(
      value,
      CellType.Icon,
      !disabledColor ? (value ? THEME_PALETTE.ACCENT : THEME_PALETTE.WARN) : ''
    );
  }

  static createCheckboxCell(selectedValue = false): CellValue {
    return new CellValue(selectedValue, CellType.Checkbox);
  }

  static createAvatarCell(value: User): CellValue {
    return new CellValue(value, CellType.Avatar);
  }

  static createDateCell(value: Date): CellValue {
    return new CellValue(value, CellType.Date);
  }

  static createEmptyCell(customClass = ''): CellValue {
    return new CellValue('-', CellType.String, customClass);
  }

  static createActionsCell(): CellValue {
    return new CellValue(undefined, CellType.Actions);
  }
}
