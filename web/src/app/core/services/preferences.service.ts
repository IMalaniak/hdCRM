import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIS } from '@/shared/constants';
import { Preferences, PreferencesList } from '../store/preferences';
import { UserPreferences } from '../modules/user-api/shared';
import { ItemApiResponse } from '@/shared/models';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  constructor(private http: HttpClient) {}

  getList(): Observable<ItemApiResponse<PreferencesList>> {
    return this.http.get<ItemApiResponse<PreferencesList>>(APIS.PREFERENCES);
  }

  set(preferences: Preferences): Observable<ItemApiResponse<UserPreferences>> {
    return this.http.post<ItemApiResponse<UserPreferences>>(APIS.PREFERENCES, preferences);
  }
}
