import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemApiResponse, DymanicForm } from '@/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private api = '/forms';

  constructor(private http: HttpClient) {}

  getOne(formName: string): Observable<ItemApiResponse<DymanicForm>> {
    return this.http.get<ItemApiResponse<DymanicForm>>(`${this.api}/${formName}`);
  }

  generateFormGroupFrom(json: DymanicForm, data?: any): FormGroup {
    const group = {};
    json.formItems.forEach(fieldTemplate => {
      group[fieldTemplate.controlName] = new FormControl('');
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
