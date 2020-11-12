import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/reducers/preferences.reducer';
import { SharedModule } from '@/shared/shared.module';
import { Department } from '@/modules/departments/models';
import { authStateMock, currentUserMock, formsStateMock } from '@/shared/testing/mocks';
import { FORMCONSTANTS } from '@/shared/constants';
import { TemplatesDepartmentViewComponent } from './templates-department-view.component';

describe('TemplatesDepartmentViewComponent', () => {
  let component: TemplatesDepartmentViewComponent;
  let fixture: ComponentFixture<TemplatesDepartmentViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock
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

  const update = {
    title: 'New title'
  } as Department;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatesDepartmentViewComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { formJSON: formsStateMock.entities[FORMCONSTANTS.DEPARTMENT] } } }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesDepartmentViewComponent);
    component = fixture.componentInstance;
    component.department = { ...departmentMock };
    component.canEdit = true;
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

  it('should emit true when edit button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(true));
    component.onClickEdit();
  });

  it('should emit false when cancel button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(false));
    component.onClickCancelEdit();
  });

  it('should remove manager', () => {
    component.removeManager();
    expect(component.department.Manager).toEqual(null);
  });

  it('should remove worker', () => {
    component.removeWorker(currentUserMock.id);
    expect(component.department.Workers).toEqual([]);
  });

  it('should emit changes', () => {
    component.departmentFormValues = { ...update };
    component.saveChanges.subscribe((savedDepartment: Department) =>
      expect(savedDepartment).toEqual({ ...departmentMock, ...update })
    );
    component.saveDepartment();
  });

  it('should update department on form change', () => {
    component.departmentFormValueChanges(update);
    expect(component.departmentFormValues).toEqual({ ...update });
  });
});
