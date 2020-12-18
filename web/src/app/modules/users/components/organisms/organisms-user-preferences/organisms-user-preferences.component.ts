import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { enableDarkTheme } from '@/core/modules/layout/store/layout.actions';
import {
  changeTimeFormat,
  changeDateFormat,
  changeItemsPerPage,
  changeListView,
  preferencesListRequested
} from '@/core/reducers/preferences.actions';
import { PreferencesList, Preferences } from '@/core/reducers/preferences.reducer';
import { getPreferencesList } from '@/core/reducers/preferences.selectors';
import { IFieldType } from '@/shared/constants';

@Component({
  selector: 'organisms-user-preferences',
  templateUrl: './organisms-user-preferences.component.html',
  styleUrls: ['./organisms-user-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserPreferencesComponent implements OnInit, OnChanges {
  preferencesList$: Observable<PreferencesList> = this.store$.pipe(select(getPreferencesList));

  @Input() enabledDarkTheme: boolean;
  @Input() userPreferences: Preferences;

  // TODO: @IMalaniak this we change to come from BE
  themes = [
    {
      value: true,
      label: 'Dark'
    },
    {
      value: false,
      label: 'Light'
    }
  ];
  fieldTypes = IFieldType;

  currentDate = new Date();
  preferencesForm: FormGroup;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.preferencesForm?.get('theme').patchValue(this.enabledDarkTheme);
  }

  ngOnInit(): void {
    this.store$.dispatch(preferencesListRequested());
    this.buildPreferencesGroup();
  }

  buildPreferencesGroup(): void {
    this.preferencesForm = this.fb.group({
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
    this.store$.dispatch(enableDarkTheme({ enabled: event.value }));
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
