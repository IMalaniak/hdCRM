import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { departmentsFeatureKey, initialDepartmentApiState } from '@core/modules/department-api/store';
import { SharedModule } from '@shared/shared.module';
import { formsStateMock } from '@shared/testing/mocks';

import { TemplatesDepartmentViewComponent } from '../templates';

import { AddDepartmentComponent } from './add-department.component';

describe('AddDepartmentComponent', () => {
  let component: AddDepartmentComponent;
  let fixture: ComponentFixture<AddDepartmentComponent>;
  const initialState = {
    forms: formsStateMock,
    [departmentsFeatureKey]: initialDepartmentApiState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddDepartmentComponent, TemplatesDepartmentViewComponent],
        imports: [HttpClientModule, MatIconTestingModule, RouterTestingModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
