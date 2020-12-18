import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIS } from '@/shared/constants';
import { UserPreferences } from '@/modules/users/models';
import { Preferences, PreferencesList } from '../reducers/preferences/preferences.reducer';

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
