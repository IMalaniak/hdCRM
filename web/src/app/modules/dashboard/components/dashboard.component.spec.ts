import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialDepartmentApiState } from '@core/modules/department-api/store';
import { initialStagesState } from '@core/modules/plan-api/store/stage';
import { initialRolesState } from '@core/modules/role-api/store/role';
import { initialPreferencesState } from '@core/store/preferences';
import { SharedModule } from '@shared/shared.module';
import { authStateMock } from '@shared/testing/mocks';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    'role-api': initialRolesState,
    'stage-api': initialStagesState,
    'department-api': initialDepartmentApiState
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
