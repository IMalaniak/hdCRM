import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { enableDarkTheme } from '@/core/layout/store/layout.actions';
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
  styleUrls: ['./organisms-user-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserPreferencesComponent implements OnInit, OnChanges {
  @Input() enabledDarkTheme: boolean;
  @Input() userPreferences: Preferences;

  preferencesList$: Observable<PreferencesList>;
  currentDate = new Date();
  preferencesForm: FormGroup;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.preferencesForm?.get('theme').patchValue(this.enabledDarkTheme);
  }

  ngOnInit(): void {
    this.preferencesList$ = this.store$.pipe(select(getPreferencesList));
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
      example: new FormControl(20)
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

  // FOR TEST RADIO BUTTON
  onExampleChange($event: MatRadioChange) {
    console.log('EVENT FORM HTML:', $event);
    console.log(this.preferencesForm.get('example').value);
  }

  onClick($event) {
    console.log('CLICK FORM HTML:', $event);
  }
}
