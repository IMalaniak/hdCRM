import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPreferencesState } from '@/core/store/preferences';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';
import { FORM_TYPE, FIELD_TYPE } from '@/shared/constants';

import { TemplatesViewDetailsComponent } from './templates-view-details.component';

@Component({
  template: ` <dynamic-form [data]="item" [formJson]="formJson$ | async" [editForm]="editForm"> </dynamic-form> `
})
export class TestViewComponent extends TemplatesViewDetailsComponent<TestItem> {
  editForm = false;
  protected readonly formName = 'testForm';
}

interface TestItem {
  id: number;
  title: string;
}

describe('TemplatesViewDetailsComponent', () => {
  let component: TestViewComponent;
  let fixture: ComponentFixture<TestViewComponent>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: {
      isLoading: false,
      ids: [],
      entities: {
        testForm: {
          key: 'testForm',
          name: 'Test Form',
          type: FORM_TYPE.SYSTEM,
          form: [
            {
              controlName: 'title',
              type: FIELD_TYPE.INPUT,
              label: 'Title',
              isEditable: true,
              required: true
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    }
  };

  const itemMock: TestItem = {
    id: 1,
    title: 'Test item'
  };

  const update = {
    title: 'New title'
  } as TestItem;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestViewComponent, TemplatesViewDetailsComponent],
        imports: [BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent<TestViewComponent>(TestViewComponent);
    component = fixture.componentInstance;
    component.item = { ...itemMock };
    component.canEdit = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when edit button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(true));
    component.onClickEdit();
  });

  it('should emit false when cancel button is clicked', () => {
    component.isEditing.subscribe((isEditing: boolean) => expect(isEditing).toBe(false));
    component.onClickCancelEdit();
  });

  it('should emit changes', () => {
    component.dynamicForm.form.patchValue(update);
    component.saveChanges.subscribe((savedItem: TestItem) => expect(savedItem).toEqual({ ...itemMock, ...update }));
    component.save();
  });
});
