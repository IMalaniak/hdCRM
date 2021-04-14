import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialRolesState } from '@core/modules/role-api/store/role';
import { initialUsersState } from '@core/modules/user-api/store';
import { SharedModule } from '@shared/shared.module';
import { initialListState } from '@shared/store';
import { authStateMock, formsStateMock } from '@shared/testing/mocks';

import { TemplatesRoleViewComponent } from '../templates';

import { RoleComponent } from './role.component';

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;
  const initialState = {
    auth: authStateMock,
    'user-api': initialUsersState,
    'role-api': initialRolesState,
    'role-management': initialListState,
    forms: formsStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RoleComponent, TemplatesRoleViewComponent],
        imports: [RouterTestingModule, MatIconTestingModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
