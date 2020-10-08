import { Logger } from '@overnightjs/logger';
import { Form } from '../models';
import { FormAttributes } from '../models/Form';

export class FormDBController {
  public getByFormName(key: string): Promise<Form> {
    Logger.Info(`Selecting form by key: ${key}...`);
    return Form.findByPk(key);
  }

  public create(body: FormAttributes): Promise<Form> {
    Logger.Info(`Creating new form...`);
    return Form.create(body);
  }

  public updateOne(form: FormAttributes): Promise<[number, Form[]]> {
    Logger.Info(`Updating form by key: ${form.key}...`);
    return Form.update(
      {
        ...form
      },
      {
        where: { key: form.key }
      }
    );
  }

  public deleteForm(key: string | string[]) {
    Logger.Info(`Deleting form by id: ${key}...`);
    return Form.destroy({
      where: { key }
    });
  }
}
