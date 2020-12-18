import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialUsersState } from '@/core/modules/user-api/store';
import { initialPreferencesState } from '@/core/store/preferences';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';
import { initialDepartmentsState } from '../../store/department.reducer';
import { DepartmentsComponent } from './departments.component';

describe('DepartmentsComponent', () => {
  let component: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    departments: initialDepartmentsState,
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DepartmentsComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
