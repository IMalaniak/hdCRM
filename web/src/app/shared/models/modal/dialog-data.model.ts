import { BaseModel } from '../base';
import { DialogWithTwoButtonModel } from './dialog-with-two-button.model';

export class DialogDataModel<TDialogModel extends DialogWithTwoButtonModel, TModel extends BaseModel> {
  constructor(public dialogModel: TDialogModel, public model?: TModel) {}
}
