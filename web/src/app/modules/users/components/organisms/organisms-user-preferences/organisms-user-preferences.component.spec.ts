import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/reducers/preferences/preferences.reducer';
import { SharedModule } from '@/shared/shared.module';
import { OrganismsUserPreferencesComponent } from './organisms-user-preferences.component';

describe('OrganismsUserPreferencesComponent', () => {
  let component: OrganismsUserPreferencesComponent;
  let fixture: ComponentFixture<OrganismsUserPreferencesComponent>;
  const initialState = {
    preferences: initialPreferencesState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserPreferencesComponent],
        imports: [RouterTestingModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserPreferencesComponent);
    component = fixture.componentInstance;
    component.userPreferences = initialPreferencesState;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
