import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { plansFeatureKey, initialPlansState } from '@core/modules/plan-api/store/plan';
import { SharedModule } from '@shared/shared.module';
import { authStateMock, formsStateMock } from '@shared/testing/mocks';

import { TemplatesPlanViewComponent } from '../templates';

import { AddPlanComponent } from './add-plan.component';

describe('AddPlanComponent', () => {
  let component: AddPlanComponent;
  let fixture: ComponentFixture<AddPlanComponent>;
  const initialState = {
    auth: authStateMock,
    forms: formsStateMock,
    [plansFeatureKey]: initialPlansState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddPlanComponent, TemplatesPlanViewComponent],
        imports: [SharedModule, MatIconTestingModule, HttpClientModule, RouterTestingModule, BrowserAnimationsModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
