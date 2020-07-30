import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences, PreferencesList } from '../reducers/preferences.reducer';
import { UserPreferences } from '@/modules/users/models';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private preferencesApi: string;

  constructor(private http: HttpClient) {
    this.preferencesApi = '/preferences';
  }

  getList(): Observable<PreferencesList> {
    return this.http.get<PreferencesList>(this.preferencesApi);
  }

  set(preferences: Preferences): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(this.preferencesApi, preferences);
  }
}
