import { CellActionType } from './cellActionType.enum';
import { CellControlType } from './cellControlType.enum';
import { CellValueType } from './cellValueType.enum';
import { Navigation } from './navigation';
import { CellAction } from './cell-action';
import { User } from '@/modules/users';
import { ACTION_LABELS, BS_ICONS, STYLECONSTANTS } from '@/shared/constants';

export class CellValue {
  cellAction: CellActionType;

  constructor(
    readonly value: any,
    readonly controlType: CellControlType,
    readonly customClass?: string,
    readonly navigation?: Navigation,
    readonly valueType: CellValueType = CellValueType.Value,
    readonly actions: CellAction[] = [],
    readonly disabled = false
  ) {}

  static createSequenceNumberCell(): CellValue {
    return new CellValue(undefined, CellControlType.SequenceNumber);
  }

  static createSpanCell(value: string, customClass?: string): CellValue {
    return new CellValue(value, CellControlType.Span, customClass);
  }

  static createLinkCell(value: string, navigation: Navigation): CellValue {
    return new CellValue(value, CellControlType.Navigation, undefined, navigation);
  }

  static createBooleanIconCell(value: boolean, disabledColor = false): CellValue {
    return new CellValue(
      value,
      CellControlType.Icon,
      !disabledColor ? (value ? STYLECONSTANTS.SUCCESS : STYLECONSTANTS.DANGER) : ''
    );
  }

  static createCheckboxCell(action: CellActionType, value = false): CellValue {
    let cell: CellValue = new CellValue(value, CellControlType.Checkbox);
    return (cell = { ...cell, cellAction: action });
  }

  static createAvatarCell(value: User): CellValue {
    return new CellValue(value, CellControlType.Avatar);
  }

  static createEmptyCell(): CellValue {
    return new CellValue('-', CellControlType.Span);
  }

  static createActionsCell(additionalActions?: CellAction[]): CellValue {
    // TODO: decide best way to bind actions with privileges, maybe it will be better to move this method to common class in next task, or send provoleges separately in table with using async pipe
    let actions: CellAction[] = [];

    if (additionalActions?.length) {
      actions = [...actions, ...additionalActions];
    }

    // if (privilege) {
    actions = [...actions, { type: CellActionType.Details, icon: BS_ICONS.InfoSquare, message: ACTION_LABELS.DETAILS }];
    // }

    // if (privilege) {
    actions = [...actions, { type: CellActionType.Edit, icon: BS_ICONS.Pencil, message: ACTION_LABELS.EDIT }];
    // }

    // if (privilege) {
    actions = [...actions, { type: CellActionType.Delete, icon: BS_ICONS.Trash, message: ACTION_LABELS.DELETE }];
    // }

    return new CellValue(undefined, CellControlType.Action, undefined, undefined, CellValueType.Actions, actions);
  }
}
