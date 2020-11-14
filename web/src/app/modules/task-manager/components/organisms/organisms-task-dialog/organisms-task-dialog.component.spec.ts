import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@/shared/shared.module';
import { formsStateMock } from '@/shared/testing/mocks';
import { OrganismsTaskDialogComponent } from './organisms-task-dialog.component';
import { DialogCreateEditModel } from '@/shared/models';
import { HttpClientModule } from '@angular/common/http';

describe('OrganismsTaskDialogComponent', () => {
  let component: OrganismsTaskDialogComponent<DialogCreateEditModel>;
  let fixture: ComponentFixture<OrganismsTaskDialogComponent<DialogCreateEditModel>>;
  const initialState = {
    forms: formsStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsTaskDialogComponent],
        imports: [HttpClientModule, SharedModule, BrowserAnimationsModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
