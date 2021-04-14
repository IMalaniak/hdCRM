import { DialogConstants } from '@shared/constants';

import { DIALOG_MODE } from './dialog-mode.enum';
import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';

export class DialogCreateEditModel extends DialogWithTwoButtonModel {
  constructor(
    public dialogMode: DIALOG_MODE,
    title = DialogConstants.CREATE,
    btnOkText = DialogConstants.OK,
    btnCancelText = DialogConstants.CANCEL
  ) {
    super(title, btnOkText, btnCancelText);
  }
}
