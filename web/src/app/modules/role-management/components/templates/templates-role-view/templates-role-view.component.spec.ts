import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { Role } from '@/core/modules/role-api/shared';
import { initialRolesState, rolesFeatureKey } from '@/core/modules/role-api/store/role';
import { COLUMN_KEYS } from '@/shared/constants';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock, currentUserMock } from '@/shared/testing/mocks';
import { TemplatesRoleViewComponent } from './templates-role-view.component';

describe('TemplatesRoleViewComponent', () => {
  let component: TemplatesRoleViewComponent;
  let fixture: ComponentFixture<TemplatesRoleViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: formsStateMock,
    [rolesFeatureKey]: initialRolesState
  };

  const roleMock: Role = {
    id: 1,
    keyString: 'Test role',
    Users: [currentUserMock],
    Privileges: [
      {
        id: 1,
        keyString: 'user',
        title: 'User Management',
        RolePrivilege: { add: true, delete: false, edit: false, view: true }
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const update = {
    keyString: 'New title'
  } as Role;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesRoleViewComponent],
        imports: [BrowserAnimationsModule, MatIconTestingModule, HttpClientModule, RouterTestingModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesRoleViewComponent);
    component = fixture.componentInstance;
    component.canEdit = true;
    component.item = roleMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have role title', () => {
    const departmentDe: DebugElement = fixture.debugElement;
    const titleDe = departmentDe.queryAll(By.css('.mat-title'));
    const title: HTMLElement = titleDe[0].nativeElement;
    expect(title.textContent).toEqual('Test role');
    expect(component.cardTitle()).toEqual('Test role');

    component.isCreatePage = true;
    fixture.detectChanges();
    expect(component.cardTitle()).toEqual('Create role');
  });

  it('should remove user', () => {
    component.removeUser(currentUserMock.id);
    expect(component.item.Users).toEqual([]);
  });

  it('should remove privilege', () => {
    component.removePrivilege(1);
    expect(component.item.Privileges).toEqual([]);
  });

  it('should emit true when edit button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(true));
    component.onClickEdit();
    expect(component.displayedColumns.includes(COLUMN_KEYS.ACTIONS)).toBe(true);
  });

  it('should emit false when cancel button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(false));
    component.onClickCancelEdit();
    expect(component.displayedColumns.includes(COLUMN_KEYS.ACTIONS)).toBe(false);
  });

  it('should emit changes', () => {
    component.dynamicForm.form.patchValue(update);
    component.saveChanges.subscribe((savedItem: Role) => expect(savedItem).toEqual({ ...roleMock, ...update }));
    component.save();
  });
});
