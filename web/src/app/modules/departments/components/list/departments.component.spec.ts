import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsComponent } from './departments.component';

import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initialDepartmentsState } from '../../store/department.reducer';
import { authStateMock } from '@/shared/testing/mocks';
import { initialPreferencesState } from '@/core/reducers/preferences.reducer';

describe('DepartmentsComponent', () => {
  let component: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    departments: initialDepartmentsState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DepartmentsComponent],
        imports: [RouterTestingModule, BrowserAnimationsModule, SharedModule],
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
