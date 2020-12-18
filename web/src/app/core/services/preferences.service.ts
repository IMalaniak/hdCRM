import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIS } from '@/shared/constants';
import { Preferences, PreferencesList } from '../store/preferences';
import { UserPreferences } from '../modules/user-api/shared';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  constructor(private http: HttpClient) {}

  getList(): Observable<PreferencesList> {
    return this.http.get<PreferencesList>(APIS.PREFERENCES);
  }

  set(preferences: Preferences): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(APIS.PREFERENCES, preferences);
  }
}
