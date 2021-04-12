import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRolesState, rolesFeatureKey } from '@/core/modules/role-api/store/role';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';

import { TemplatesRoleViewComponent } from '../templates';

import { AddRoleComponent } from './add-role.component';

describe('AddRoleComponent', () => {
  let component: AddRoleComponent;
  let fixture: ComponentFixture<AddRoleComponent>;
  const initialState = {
    auth: authStateMock,
    forms: formsStateMock,
    [rolesFeatureKey]: initialRolesState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddRoleComponent, TemplatesRoleViewComponent],
        imports: [HttpClientModule, MatIconTestingModule, RouterTestingModule, SharedModule, BrowserAnimationsModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
