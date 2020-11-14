import { DIALOG } from '@/shared/constants';

export class DialogWithTwoButtonModel {
  constructor(public titleMessageKey = '', public btnOkTextKey = DIALOG.OK, public btnCancelTextKey = DIALOG.CANCEL) {}
}
