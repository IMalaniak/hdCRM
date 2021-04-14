import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiRoutesConstants } from '@shared/constants';
import { ItemApiResponse } from '@shared/models';

import { UserPreferences } from '../modules/user-api/shared';
import { Preferences, PreferencesList } from '../store/preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  constructor(private http: HttpClient) {}

  getList(): Observable<ItemApiResponse<PreferencesList>> {
    return this.http.get<ItemApiResponse<PreferencesList>>(ApiRoutesConstants.PREFERENCES);
  }

  set(preferences: Preferences): Observable<ItemApiResponse<UserPreferences>> {
    return this.http.post<ItemApiResponse<UserPreferences>>(ApiRoutesConstants.PREFERENCES, preferences);
  }
}
