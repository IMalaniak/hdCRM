import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialLayoutState } from '@core/modules/layout/store';
import { initialUsersState } from '@core/modules/user-api/store';
import { initialPreferencesState } from '@core/store/preferences';
import { SharedModule } from '@shared/shared.module';
import { initialListState } from '@shared/store';
import { authStateMock } from '@shared/testing/mocks';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  const initialState = {
    auth: authStateMock,
    preferences: initialPreferencesState,
    'user-api': initialUsersState,
    'user-management': initialListState,
    layout: initialLayoutState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersComponent],
        imports: [RouterTestingModule, MatIconTestingModule, HttpClientModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
