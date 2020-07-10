import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import * as layoutActions from '@/core/layout/store/layout.actions';

@Component({
  selector: 'organisms-user-preferences',
  templateUrl: './organisms-user-preferences.component.html',
  styleUrls: ['./organisms-user-preferences.component.scss']
})
export class OrganismsUserPreferencesComponent implements OnInit {
  @Input() enabledDarkTheme: boolean;

  themes: string[] = ['Light theme', 'Dark theme']; // TODO: @ArseniiIrod remove it after created end-point

  preferencesGroup: FormGroup;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildPreferencesGroup();
  }

  buildPreferencesGroup(): void {
    this.preferencesGroup = this.fb.group({
      timeFormat: new FormControl(null),
      timeZone: new FormControl(null),
      dateFormat: new FormControl(null),
      currency: new FormControl(null),
      language: new FormControl(null),
      theme: new FormControl(!this.enabledDarkTheme ? this.themes[0] : this.themes[1]),
      fontSize: new FormControl(null),
      listView: new FormControl(null),
      itemsPerPage: new FormControl(null)
    });
  }

  onThemeChange(event: MatRadioChange): void {
    this.store.dispatch(layoutActions.enableDarkTheme({ enabled: !!(event.value === 'Dark theme') }));
  }
}
