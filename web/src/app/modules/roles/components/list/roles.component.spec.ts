import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { AppState } from '@/core/store';
import { initialPreferencesState } from '@/core/store/preferences';
import { AuthState } from '@/core/modules/auth/store/auth.reducer';
import { initialUsersState, UsersState } from '@/core/modules/user-api/store';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';
import { RoleService } from '../../services';
import { RolesComponent } from './roles.component';
import { initialRolesState } from '../../store/role.reducer';
import { RolesState } from '../../store/role.reducer';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  const initialState: Partial<AppState> & { roles: RolesState; auth: AuthState; users: UsersState } = {
    preferences: initialPreferencesState,
    roles: initialRolesState,
    users: initialUsersState,
    auth: authStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RolesComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [RoleService, provideMockStore({ initialState })]
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
