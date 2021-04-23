import { STYLE } from '@shared/constants';
import { COLUMN_LABEL, COLUMN_KEY } from '@shared/constants/table.constants';

import { HORIZONTAL_ALIGN } from './horizontal-align.enum';

export interface IColumn {
  readonly key: string;
  readonly label: string;
  readonly horizontalAlign: HORIZONTAL_ALIGN;
  isVisible: boolean;
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
    horizontalAlign = HORIZONTAL_ALIGN.LEFT,
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
      label: COLUMN_LABEL[key.toUpperCase()],
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
    return this.createColumn({ key: COLUMN_KEY.SEQUENCE, draggable: false, hasSorting: false });
  }

  static createCheckboxColumn(): IColumn {
    return this.createColumn({
      key: COLUMN_KEY.SELECT,
      horizontalAlign: HORIZONTAL_ALIGN.CENTER,
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
      customClass: STYLE.PL_HEADER_LINK
    });
  }

  static createActionsColumn(): IColumn {
    return this.createColumn({
      key: COLUMN_KEY.ACTIONS,
      horizontalAlign: HORIZONTAL_ALIGN.CENTER,
      hidable: false,
      draggable: false,
      hasSorting: false,
      stickyEnd: true
    });
  }
}
