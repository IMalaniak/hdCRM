import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { Plan } from '@core/modules/plan-api/shared';
import { plansFeatureKey, initialPlansState } from '@core/modules/plan-api/store/plan';
import { initialPreferencesState } from '@core/store/preferences';
import { Asset } from '@shared/models';
import { SharedModule } from '@shared/shared.module';
import { authStateMock, currentUserMock, formsStateMock } from '@shared/testing/mocks';

import { TemplatesPlanViewComponent } from './templates-plan-view.component';

describe('TemplatesPlanViewComponent', () => {
  let component: TemplatesPlanViewComponent;
  let fixture: ComponentFixture<TemplatesPlanViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: formsStateMock,
    [plansFeatureKey]: initialPlansState
  };

  const planMock: Plan = {
    id: 1,
    title: 'Test plan',
    description: 'Test description',
    budget: 1000,
    CreatorId: 1,
    Creator: currentUserMock,
    Participants: [currentUserMock],
    Documents: [],
    progress: 0,
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  } as Plan;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesPlanViewComponent],
        imports: [BrowserAnimationsModule, MatIconTestingModule, HttpClientModule, RouterTestingModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesPlanViewComponent);
    component = fixture.componentInstance;
    component.canEdit = true;
    component.item = planMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have plan title', () => {
    const departmentDe: DebugElement = fixture.debugElement;
    const titleDe = departmentDe.queryAll(By.css('.mat-title'));
    const title: HTMLElement = titleDe[0].nativeElement;
    expect(title.textContent).toEqual('Test plan');
    expect(component.cardTitle()).toEqual('Test plan');

    component.isCreatePage = true;
    fixture.detectChanges();
    expect(component.cardTitle()).toEqual('Create plan');
  });

  it('should remove participant', () => {
    component.removeParticipant(currentUserMock.id);
    expect(component.item.Participants).toEqual([]);
  });

  it('should emit plan with new document', () => {
    const newAsset = { title: 'Test doc' } as Asset;
    component.saveChanges.subscribe((savedPlan: Plan) =>
      expect(savedPlan).toEqual({ ...planMock, Documents: [newAsset] })
    );
    component.addDocument(newAsset);
  });
});
