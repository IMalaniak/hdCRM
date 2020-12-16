import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';
import { initialUsersState } from '@/modules/users/store/user.reducer';
import { initialRolesState } from '../../store/role.reducer';
import { RoleComponent } from './role.component';
import { TemplatesRoleViewComponent } from '../templates';

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;
  const initialState = {
    auth: authStateMock,
    users: initialUsersState,
    roles: initialRolesState,
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
