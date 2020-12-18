import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';
import { initialRolesState } from '@/modules/roles/store/role.reducer';
import { initialStagesState } from '@/modules/planner/store/stage.reducer';
import { DashboardComponent } from './dashboard.component';
import { initialDepartmentApiState } from '@/core/modules/department-api/store';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    roles: initialRolesState,
    stages: initialStagesState,
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
