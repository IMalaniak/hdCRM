import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/reducers/preferences.reducer';
import { initialLayoutState } from '@/core/modules/layout/store/layout.reducer';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';
import { initialUsersState } from '../../store/user.reducer';
import { TemplatesUserProfileComponent } from '../templates';
import { ProfileComponent } from './profile.component';
import { OrganismsUserDetailsComponent } from '../organisms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const initialState = {
    auth: authStateMock,
    preferences: initialPreferencesState,
    users: initialUsersState,
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
