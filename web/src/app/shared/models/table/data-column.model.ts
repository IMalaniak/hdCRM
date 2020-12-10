import { STYLECONSTANTS } from '@/shared/constants';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';
import { ColumnSize } from './columnSize.enum';
import { HorizontalAlign } from './horizontalAlign.enum';

export class DataColumn {
  constructor(
    readonly title: string,
    readonly size?: ColumnSize,
    readonly horizontalAlign: HorizontalAlign = HorizontalAlign.Left,
    public isVisible = true,
    readonly hasSorting: boolean = true,
    readonly customClass?: string,
    readonly sticky: boolean = false,
    readonly stickyEnd: boolean = false
  ) {}

  static createSequenceNumberColumn(): DataColumn {
    return new DataColumn(COLUMN_NAMES.SEQUENCE_NUMBER, ColumnSize.SECUENCE, HorizontalAlign.Left, true, false);
  }

  static createLinkColumn({
    title = '',
    size = ColumnSize.MD,
    hasSorting = true
  }: {
    title: string;
    size?: ColumnSize;
    hasSorting?: boolean;
  }): DataColumn {
    return new DataColumn(title, size, HorizontalAlign.Left, true, hasSorting, STYLECONSTANTS.PL_HEADER_LINK);
  }

  static createActionsColumn(): DataColumn {
    return new DataColumn(
      COLUMN_NAMES.ACTIONS,
      ColumnSize.ACTIONS,
      HorizontalAlign.Center,
      true,
      false,
      '',
      false,
      true
    );
  }
}
