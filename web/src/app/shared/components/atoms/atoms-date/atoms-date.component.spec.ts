import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@core/store/preferences';
import { SharedModule } from '@shared/shared.module';

import { AtomsDateComponent } from './atoms-date.component';

@Component({
  template: `<form [formGroup]="form">
    <atoms-date formControlName="date"> </atoms-date>
  </form>`
})
class TestAtomsDateComponent {
  @ViewChild(AtomsDateComponent, { static: true })
  dateInputComponent: AtomsDateComponent;

  form = new FormGroup({
    date: new FormControl(new Date('2020-12-14T11:04:06.317Z'))
  });
}

describe('AtomsDateComponent', () => {
  let component: TestAtomsDateComponent;
  let fixture: ComponentFixture<TestAtomsDateComponent>;
  const initialState = {
    preferences: initialPreferencesState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsDateComponent, TestAtomsDateComponent],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAtomsDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
