import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { initialUsersState } from '@/core/modules/user-api/store';
import { initialRolesState } from '@/core/modules/role-api/store/role';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';
import { RolesComponent } from './roles.component';
import { initialListState } from '@/shared/store';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    'role-api': initialRolesState,
    'role-management': initialListState,
    'user-api': initialUsersState,
    auth: authStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RolesComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
