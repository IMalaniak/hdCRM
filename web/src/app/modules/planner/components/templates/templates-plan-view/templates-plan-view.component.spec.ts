import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Plan } from '@/modules/planner/models';

import { TemplatesPlanViewComponent } from './templates-plan-view.component';
import { authStateMock, currentUserMock, formsStateMock } from '@/shared/testing/mocks';
import { FORMCONSTANTS } from '@/shared/constants';
import { SharedModule } from '@/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPreferencesState } from '@/core/reducers/preferences.reducer';
import { Asset } from '@/shared/models';

describe('TemplatesPlanViewComponent', () => {
  let component: TemplatesPlanViewComponent;
  let fixture: ComponentFixture<TemplatesPlanViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: formsStateMock
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
        imports: [BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesPlanViewComponent);
    component = fixture.componentInstance;
    component.canEdit = true;
    component.formName = FORMCONSTANTS.PLAN;
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
