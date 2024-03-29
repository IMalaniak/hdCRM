import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialLayoutState } from '@core/modules/layout/store/layout.reducer';
import { initialUsersState } from '@core/modules/user-api/store';
import { initialPreferencesState } from '@core/store/preferences';
import { SharedModule } from '@shared/shared.module';
import { initialListState } from '@shared/store';
import { authStateMock, formsStateMock } from '@shared/testing/mocks';

import { OrganismsUserDetailsComponent } from '../organisms';
import { TemplatesUserProfileComponent } from '../templates';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const initialState = {
    auth: authStateMock,
    preferences: initialPreferencesState,
    'user-api': initialUsersState,
    'user-management': initialListState,
    layout: initialLayoutState,
    forms: formsStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProfileComponent, TemplatesUserProfileComponent, OrganismsUserDetailsComponent],
        imports: [RouterTestingModule, MatIconTestingModule, HttpClientModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
