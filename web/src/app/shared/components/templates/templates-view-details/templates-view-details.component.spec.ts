import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, formsStateMock } from '@/shared/testing/mocks';
import { TemplatesViewDetailsComponent } from './templates-view-details.component';

interface TestItem {
  id: number;
  title: string;
}

describe('TemplatesViewDetailsComponent', () => {
  let component: TemplatesViewDetailsComponent<TestItem>;
  let fixture: ComponentFixture<TemplatesViewDetailsComponent<TestItem>>;
  const initialState = {
    preferences: initialPreferencesState,
    auth: authStateMock,
    forms: formsStateMock
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
        declarations: [TemplatesViewDetailsComponent],
        imports: [BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent<TemplatesViewDetailsComponent<TestItem>>(TemplatesViewDetailsComponent);
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
    component.formValues = { ...update };
    component.saveChanges.subscribe((savedItem: TestItem) => expect(savedItem).toEqual({ ...itemMock, ...update }));
    component.save();
  });

  it('should update item on form change', () => {
    component.formValueChanges(update);
    expect(component.formValues).toEqual({ ...update });
  });
});
