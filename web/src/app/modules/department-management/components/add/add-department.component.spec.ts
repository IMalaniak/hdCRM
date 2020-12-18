import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@/shared/shared.module';
import { formsStateMock } from '@/shared/testing/mocks';
import { AddDepartmentComponent } from './add-department.component';
import { TemplatesDepartmentViewComponent } from '../templates';

describe('AddDepartmentComponent', () => {
  let component: AddDepartmentComponent;
  let fixture: ComponentFixture<AddDepartmentComponent>;
  const initialState = {
    forms: formsStateMock
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
