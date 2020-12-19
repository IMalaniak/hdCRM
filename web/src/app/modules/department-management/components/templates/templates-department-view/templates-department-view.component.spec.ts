import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { Department } from '@/core/modules/department-api/shared';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, currentUserMock, formsStateMock } from '@/shared/testing/mocks';
import { FORMCONSTANTS } from '@/shared/constants';
import { TemplatesDepartmentViewComponent } from './templates-department-view.component';

describe('TemplatesDepartmentViewComponent', () => {
  let component: TemplatesDepartmentViewComponent;
  let fixture: ComponentFixture<TemplatesDepartmentViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: formsStateMock
  };

  const departmentMock: Department = {
    id: 1,
    title: 'Test department',
    description: 'Test description',
    managerId: 1,
    Manager: currentUserMock,
    Workers: [currentUserMock],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesDepartmentViewComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesDepartmentViewComponent);
    component = fixture.componentInstance;
    component.item = departmentMock;
    component.canEdit = true;
    component.formName = FORMCONSTANTS.DEPARTMENT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have department title', () => {
    const departmentDe: DebugElement = fixture.debugElement;
    const titleDe = departmentDe.queryAll(By.css('.mat-title'));
    const title: HTMLElement = titleDe[0].nativeElement;
    expect(title.textContent).toEqual('Test department');
    expect(component.cardTitle()).toEqual('Test department');

    component.isCreatePage = true;
    fixture.detectChanges();
    expect(component.cardTitle()).toEqual('Create department');
  });

  it('should remove manager', () => {
    component.removeManager();
    expect(component.item.Manager).toEqual(null);
  });

  it('should remove worker', () => {
    component.removeWorker(currentUserMock.id);
    expect(component.item.Workers).toEqual([]);
  });
});
