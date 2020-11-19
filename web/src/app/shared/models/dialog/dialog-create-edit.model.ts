import { DIALOG } from '@/shared/constants';
import { DialogMode } from './dialog-mode.enum';
import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';

export class DialogCreateEditModel extends DialogWithTwoButtonModel {
  constructor(
    public dialogMode: DialogMode,
    title = DIALOG.CREATE,
    btnOkText = DIALOG.OK,
    btnCancelText = DIALOG.CANCEL
  ) {
    super(title, btnOkText, btnCancelText);
  }
}
