import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialUsersState } from '@/core/modules/user-api/store';
import { initialPlansState } from '@/core/modules/plan-api/store/plan';
import { SharedModule } from '@/shared/shared.module';
import { initialListState } from '@/shared/store';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';
import { PlanComponent } from './plan.component';
import { TemplatesPlanViewComponent } from '../templates';

describe('PlanComponent', () => {
  let component: PlanComponent;
  let fixture: ComponentFixture<PlanComponent>;
  const initialState = {
    auth: authStateMock,
    forms: formsStateMock,
    'plan-api': initialPlansState,
    'plan-management': initialListState,
    'user-api': initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PlanComponent, TemplatesPlanViewComponent],
        imports: [RouterTestingModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
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
