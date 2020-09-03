import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemApiResponse, DynamicForm } from '@/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private api = '/forms';

  constructor(private http: HttpClient) {}

  getOne(formName: string): Observable<ItemApiResponse<DynamicForm>> {
    return this.http.get<ItemApiResponse<DynamicForm>>(`${this.api}/${formName}`);
  }

  generateFormGroupFrom(json: DynamicForm, data?: any): FormGroup {
    const group = {};
    json.formItems.forEach((fieldTemplate) => {
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
