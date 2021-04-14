import { DialogConstants } from '@shared/constants';

export class DialogWithTwoButtonModel {
  constructor(
    public title = '',
    public btnOkText = DialogConstants.OK,
    public btnCancelText = DialogConstants.CANCEL
  ) {}
}
