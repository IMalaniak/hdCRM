import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';
import { DialogConstants } from '@/shared/constants/dialog.constants';

export class DialogConfirmModel extends DialogWithTwoButtonModel {
  constructor(
    public messageText = '',
    public questionText = DialogConstants.CONFIRM,
    title = '',
    btnOkText = DialogConstants.YES,
    btnCancelText = DialogConstants.CANCEL
  ) {
    super(title, btnOkText, btnCancelText);
  }
}
