import { STYLECONSTANTS } from '@/shared/constants';
import { COLUMN_LABELS, COLUMN_KEYS } from '@/shared/constants/table.constants';
import { HorizontalAlign } from './horizontalAlign.enum';

export class DataColumn {
  constructor(
    readonly key: string,
    readonly label: string,
    readonly horizontalAlign: HorizontalAlign = HorizontalAlign.Left,
    public isVisible = true,
    readonly hidable = true,
    readonly hasSorting: boolean = true,
    readonly customClass?: string,
    readonly sticky: boolean = false,
    readonly stickyEnd: boolean = false
  ) {}

  static createColumn({
    key,
    horizontalAlign = HorizontalAlign.Left,
    isVisible = true,
    hidable = true,
    hasSorting = true,
    customClass,
    sticky = false,
    stickyEnd = false
  }: {
    key: string;
    horizontalAlign?: HorizontalAlign;
    isVisible?: boolean;
    hidable?: boolean;
    hasSorting?: boolean;
    customClass?: string;
    sticky?: boolean;
    stickyEnd?: boolean;
  }): DataColumn {
    console.log(key);

    return new DataColumn(
      key,
      COLUMN_LABELS[key.toUpperCase()],
      horizontalAlign,
      isVisible,
      hidable,
      hasSorting,
      customClass,
      sticky,
      stickyEnd
    );
  }

  static createSequenceNumberColumn(): DataColumn {
    return new DataColumn(COLUMN_KEYS.SEQUENCE, COLUMN_LABELS.SEQUENCE, HorizontalAlign.Left, true, true, false);
  }

  static createLinkColumn({ key, hasSorting = true }: { key: string; hasSorting?: boolean }): DataColumn {
    return new DataColumn(
      key,
      COLUMN_LABELS[key.toUpperCase()],
      HorizontalAlign.Left,
      true,
      true,
      hasSorting,
      STYLECONSTANTS.PL_HEADER_LINK
    );
  }

  static createActionsColumn(): DataColumn {
    return new DataColumn(
      COLUMN_KEYS.ACTIONS,
      COLUMN_LABELS.ACTIONS,
      HorizontalAlign.Center,
      true,
      false,
      false,
      '',
      false,
      true
    );
  }
}
