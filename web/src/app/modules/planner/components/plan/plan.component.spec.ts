import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialUsersState } from '@/core/modules/user-api/store';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';
import { PlanService } from '../../services';
import { initialPlansState } from '../../store/plan.reducer';
import { PlanComponent } from './plan.component';
import { TemplatesPlanViewComponent } from '../templates';

describe('PlanComponent', () => {
  let component: PlanComponent;
  let fixture: ComponentFixture<PlanComponent>;
  const initialState = {
    auth: authStateMock,
    forms: formsStateMock,
    plan: initialPlansState,
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PlanComponent, TemplatesPlanViewComponent],
        imports: [RouterTestingModule, HttpClientModule, SharedModule],
        providers: [PlanService, provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
