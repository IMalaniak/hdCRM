import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';
import { DIALOG } from '@/shared/constants/dialog.constants';

export class DialogConfirmModel extends DialogWithTwoButtonModel {
  constructor(
    public messageText = '',
    public questionText = DIALOG.CONFIRM,
    title = '',
    btnOkText = DIALOG.YES,
    btnCancelText = DIALOG.CANCEL
  ) {
    super(title, btnOkText, btnCancelText);
  }
}
