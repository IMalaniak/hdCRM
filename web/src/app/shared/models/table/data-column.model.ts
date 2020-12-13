import { STYLECONSTANTS } from '@/shared/constants';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';
import { HorizontalAlign } from './horizontalAlign.enum';

export class DataColumn {
  constructor(
    readonly title: string,
    readonly horizontalAlign: HorizontalAlign = HorizontalAlign.Left,
    public isVisible = true,
    readonly hasSorting: boolean = true,
    readonly customClass?: string,
    readonly sticky: boolean = false,
    readonly stickyEnd: boolean = false
  ) {}

  static createSequenceNumberColumn(): DataColumn {
    return new DataColumn(COLUMN_NAMES.SEQUENCE_NUMBER, HorizontalAlign.Left, true, false, STYLECONSTANTS.SEQUENCE);
  }

  static createLinkColumn({ title = '', hasSorting = true }: { title: string; hasSorting?: boolean }): DataColumn {
    return new DataColumn(title, HorizontalAlign.Left, true, hasSorting, STYLECONSTANTS.PL_HEADER_LINK);
  }

  static createActionsColumn(): DataColumn {
    return new DataColumn(COLUMN_NAMES.ACTIONS, HorizontalAlign.Center, true, false, '', false, true);
  }
}
