import { DIALOG } from '@/shared/constants';

export class DialogWithTwoButtonModel {
  constructor(public title = '', public btnOkText = DIALOG.OK, public btnCancelText = DIALOG.CANCEL) {}
}
