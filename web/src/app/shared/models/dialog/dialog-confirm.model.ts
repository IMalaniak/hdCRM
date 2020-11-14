import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';
import { DIALOG } from '@/shared/constants/dialog.constants';

export class DialogConfirmModel extends DialogWithTwoButtonModel {
  constructor(
    public messageTextKey = '',
    public questionTextKey = DIALOG.CONFIRM,
    titleMessageKey = '',
    btnOkTextKey = DIALOG.YES,
    btnCancelTextKey = DIALOG.CANCEL
  ) {
    super(titleMessageKey, btnOkTextKey, btnCancelTextKey);
  }
}
