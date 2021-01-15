import { STYLECONSTANTS } from '@/shared/constants';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';
import { HorizontalAlign } from './horizontalAlign.enum';

export class DataColumn {
  constructor(
    readonly title: string,
    readonly horizontalAlign: HorizontalAlign = HorizontalAlign.Left,
    public isVisible = true,
    readonly hidable = true,
    readonly hasSorting: boolean = true,
    readonly customClass?: string,
    readonly sticky: boolean = false,
    readonly stickyEnd: boolean = false
  ) {}

  static createColumn({
    title,
    horizontalAlign = HorizontalAlign.Left,
    isVisible = true,
    hidable = true,
    hasSorting = true,
    customClass,
    sticky = false,
    stickyEnd = false
  }: {
    title: string;
    horizontalAlign?: HorizontalAlign;
    isVisible?: boolean;
    hidable?: boolean;
    hasSorting?: boolean;
    customClass?: string;
    sticky?: boolean;
    stickyEnd?: boolean;
  }): DataColumn {
    return new DataColumn(title, horizontalAlign, isVisible, hidable, hasSorting, customClass, sticky, stickyEnd);
  }

  static createSequenceNumberColumn(): DataColumn {
    return new DataColumn(
      COLUMN_NAMES.SEQUENCE_NUMBER,
      HorizontalAlign.Left,
      true,
      true,
      false,
      STYLECONSTANTS.SEQUENCE
    );
  }

  static createLinkColumn({ title = '', hasSorting = true }: { title: string; hasSorting?: boolean }): DataColumn {
    return new DataColumn(title, HorizontalAlign.Left, true, true, hasSorting, STYLECONSTANTS.PL_HEADER_LINK);
  }

  static createActionsColumn(): DataColumn {
    return new DataColumn(COLUMN_NAMES.ACTIONS, HorizontalAlign.Center, true, false, false, '', false, true);
  }
}
