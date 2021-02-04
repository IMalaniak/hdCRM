import { STYLECONSTANTS } from '@/shared/constants';
import { COLUMN_LABELS, COLUMN_KEYS } from '@/shared/constants/table.constants';
import { HorizontalAlign } from './horizontalAlign.enum';

export interface IColumn {
  readonly key: string;
  readonly label: string;
  readonly horizontalAlign: HorizontalAlign;
  readonly isVisible: boolean;
  readonly hidable: boolean;
  readonly draggable: boolean;
  readonly hasSorting: boolean;
  readonly sticky: boolean;
  readonly stickyEnd: boolean;
  readonly customClass?: string;
}
export class Column {
  static createColumn({
    key,
    horizontalAlign = HorizontalAlign.Left,
    isVisible = true,
    hidable = true,
    draggable = true,
    hasSorting = true,
    customClass,
    sticky = false,
    stickyEnd = false
  }: Partial<IColumn>): IColumn {
    return {
      key,
      label: COLUMN_LABELS[key.toUpperCase()],
      horizontalAlign,
      isVisible,
      hidable,
      draggable,
      hasSorting,
      customClass,
      sticky,
      stickyEnd
    };
  }

  static createSequenceNumberColumn(): IColumn {
    return this.createColumn({ key: COLUMN_KEYS.SEQUENCE, draggable: false, hasSorting: false });
  }

  static createCheckboxColumn(): IColumn {
    return this.createColumn({
      key: COLUMN_KEYS.SELECT,
      horizontalAlign: HorizontalAlign.Center,
      isVisible: false,
      hidable: false,
      draggable: false,
      hasSorting: false,
      sticky: true
    });
  }

  static createLinkColumn({ key, hasSorting = true }: { key: string; hasSorting?: boolean }): IColumn {
    return this.createColumn({
      key,
      hasSorting,
      customClass: STYLECONSTANTS.PL_HEADER_LINK
    });
  }

  static createActionsColumn(): IColumn {
    return this.createColumn({
      key: COLUMN_KEYS.ACTIONS,
      horizontalAlign: HorizontalAlign.Center,
      hidable: false,
      draggable: false,
      hasSorting: false,
      stickyEnd: true
    });
  }
}
