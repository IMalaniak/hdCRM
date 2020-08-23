import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DymanicForm } from '../reducers/dynamic-form/dynamic-form.reducer';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private api = '/forms';

  constructor(private http: HttpClient) {}

  // TODO: change this to ItemApiResponse
  getOne(formName: string): Observable<DymanicForm> {
    return this.http.get<DymanicForm>(`${this.api}/${formName}`);
  }
}
