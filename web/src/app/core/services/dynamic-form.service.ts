import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemServiceMessage, DynamicForm } from '@/shared/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIS } from '@/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private http: HttpClient) {}

  getOne(formName: string): Observable<ItemServiceMessage<DynamicForm>> {
    return this.http.get<ItemServiceMessage<DynamicForm>>(`${APIS.FORMS}/${formName}`);
  }

  generateFormGroupFrom(json: DynamicForm, data?: any): FormGroup {
    const group = {};
    json.form.forEach((fieldTemplate) => {
      group[fieldTemplate.controlName] = new FormControl(null);
      if (fieldTemplate.required) {
        group[fieldTemplate.controlName].setValidators([Validators.required]);
      }
    });
    const formGroup = new FormGroup(group);
    if (data) {
      formGroup.patchValue(data);
    }
    return formGroup;
  }
}
