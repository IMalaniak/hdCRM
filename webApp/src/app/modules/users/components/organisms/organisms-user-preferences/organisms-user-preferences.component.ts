import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'organisms-user-preferences',
  templateUrl: './organisms-user-preferences.component.html',
  styleUrls: ['./organisms-user-preferences.component.scss']
})
export class OrganismsUserPreferencesComponent implements OnInit {
  // @ArseniiIrod get this mock data properties from back-end
  currentDate: Date = new Date();
  timeZones: string[] = ['UTC', 'UTC +1', 'UTC +2', 'UTC +3'];
  currencies: string[] = ['$', '€', '₴'];
  languages: string[] = ['English', 'Українська'];
  themes: string[] = ['Light theme', 'Dark theme'];
  fontSizes: string[] = ['Small', 'Normal', 'Large'];
  listViews: string[] = ['Card view', 'Table view'];
  itemsPerPage: string[] = ['5', '10', '15', '20'];

  preferencesGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

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
      theme: new FormControl(null),
      fontSize: new FormControl(null),
      listView: new FormControl(null),
      itemsPerPage: new FormControl(null)
    });
  }
}
