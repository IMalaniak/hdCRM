import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

import { provideMockStore } from '@ngrx/store/testing';
import { authStateMock } from '@/shared/testing/mocks';
import { initialDepartmentsState } from '@/modules/departments/store/department.reducer';
import { initialPlansState } from '@/modules/planner/store/plan.reducer';
import { initialPreferencesState } from '@/core/reducers/preferences.reducer';
import { initialRolesState } from '@/modules/roles/store/role.reducer';
import { SharedModule } from '@/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    roles: initialRolesState,
    stages: initialPlansState,
    departments: initialDepartmentsState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DashboardComponent],
        imports: [SharedModule, RouterTestingModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
