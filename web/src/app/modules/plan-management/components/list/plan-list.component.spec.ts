import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialLayoutState } from '@core/modules/layout/store';
import { initialPlansState } from '@core/modules/plan-api/store/plan';
import { initialUsersState } from '@core/modules/user-api/store';
import { initialPreferencesState } from '@core/store/preferences';
import { SharedModule } from '@shared/shared.module';
import { authStateMock } from '@shared/testing/mocks';

import { PlanListComponent } from './plan-list.component';

describe('PlanListComponent', () => {
  let component: PlanListComponent;
  let fixture: ComponentFixture<PlanListComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    'plan-api': initialPlansState,
    'user-api': initialUsersState,
    layout: initialLayoutState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PlanListComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
