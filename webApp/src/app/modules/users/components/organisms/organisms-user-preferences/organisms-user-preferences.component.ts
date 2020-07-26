import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import * as layoutActions from '@/core/layout/store/layout.actions';
import {
  changeTimeFormat,
  changeDateFormat,
  changeItemsPerPage,
  changeListView,
  preferencesListRequested
} from '@/core/reducers/preferences.actions';
import { PreferencesList, Preferences } from '@/core/reducers/preferences.reducer';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { getPreferencesList } from '@/core/reducers/preferences.selectors';

@Component({
  selector: 'organisms-user-preferences',
  templateUrl: './organisms-user-preferences.component.html',
  styleUrls: ['./organisms-user-preferences.component.scss']
})
export class OrganismsUserPreferencesComponent implements OnInit {
  @Input() enabledDarkTheme: boolean;
  @Input() userPreferences: Preferences;

  preferencesList$: Observable<PreferencesList>;
  currentDate = new Date();
  preferencesFrom: FormGroup;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.preferencesList$ = this.store$.pipe(select(getPreferencesList));
    this.store$.dispatch(preferencesListRequested());
    this.buildPreferencesGroup();
  }

  buildPreferencesGroup(): void {
    this.preferencesFrom = this.fb.group({
      timeFormat: new FormControl(this.userPreferences.timeFormat),
      // timeZone: new FormControl(null),
      dateFormat: new FormControl(this.userPreferences.dateFormat),
      // currency: new FormControl(null),
      // language: new FormControl(null),
      theme: new FormControl(this.enabledDarkTheme),
      // fontSize: new FormControl(null),
      listView: new FormControl(this.userPreferences.listView),
      itemsPerPage: new FormControl(this.userPreferences.itemsPerPage)
    });
  }

  onThemeChange(event: MatRadioChange): void {
    this.store$.dispatch(layoutActions.enableDarkTheme({ enabled: event.value }));
  }

  onTimeChange(event: MatRadioChange): void {
    this.store$.dispatch(changeTimeFormat({ timeFormat: event.value }));
  }

  onDateChange(event: MatRadioChange): void {
    this.store$.dispatch(changeDateFormat({ dateFormat: event.value }));
  }

  onItemsPerPageChange(event: MatRadioChange): void {
    this.store$.dispatch(changeItemsPerPage({ itemsPerPage: event.value }));
  }

  onListViewChange(event: MatRadioChange): void {
    this.store$.dispatch(changeListView({ listView: event.value }));
  }
}
