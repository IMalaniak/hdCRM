import { SharedModule } from '@/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleService } from '../../services';
import { provideMockStore } from '@ngrx/store/testing';

import { RolesComponent } from './roles.component';
import { authStateMock } from '@/shared/testing/mocks';
import { initialPreferencesState } from '@/core/reducers/preferences.reducer';
import { initialRolesState } from '../../store/role.reducer';
import { AppState } from '@/core/reducers';
import { RolesState } from '../../store/role.reducer';
import { AuthState } from '@/core/auth/store/auth.reducer';
import { initialUsersState, UsersState } from '@/modules/users/store/user.reducer';

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
        imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
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
