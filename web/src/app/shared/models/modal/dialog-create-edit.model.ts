import { DIALOG } from '@/shared/constants';
import { DialogMode } from './dialog-mode.enum';
import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';

export class DialogCreateEditModel extends DialogWithTwoButtonModel {
  constructor(
    public dialogMode: DialogMode,
    titleMessageKey = DIALOG.CREATE,
    btnOkTextKey = DIALOG.OK,
    btnCancelTextKey = DIALOG.CANCEL
  ) {
    super(titleMessageKey, btnOkTextKey, btnCancelTextKey);
  }
}
