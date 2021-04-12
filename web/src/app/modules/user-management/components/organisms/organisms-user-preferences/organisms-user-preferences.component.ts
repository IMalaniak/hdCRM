import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import {
  changeTimeFormat,
  changeDateFormat,
  changeItemsPerPage,
  changeListView,
  preferencesListRequested,
  PreferencesList,
  Preferences,
  getPreferencesList,
  changeListBordersVisibility
} from '@/core/store/preferences';
import { enableDarkTheme } from '@/core/modules/layout/store/layout.actions';

@Component({
  selector: 'organisms-user-preferences',
  templateUrl: './organisms-user-preferences.component.html',
  styleUrls: ['./organisms-user-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserPreferencesComponent implements OnInit, OnChanges {
  @Input() enabledDarkTheme: boolean;
  @Input() userPreferences: Preferences;

  preferencesList$: Observable<PreferencesList> = this.store$.pipe(select(getPreferencesList));

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
      itemsPerPage: new FormControl(this.userPreferences.itemsPerPage),
      listOutlineBorders: new FormControl(this.userPreferences.listOutlineBorders)
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

  onBordersChange(event: MatCheckboxChange): void {
    this.store$.dispatch(changeListBordersVisibility({ isVisible: event.checked }));
  }
}
