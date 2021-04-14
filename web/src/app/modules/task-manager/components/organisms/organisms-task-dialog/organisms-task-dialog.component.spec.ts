import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { DialogCreateEditModel, DialogDataModel, DIALOG_MODE } from '@shared/models/dialog';
import { SharedModule } from '@shared/shared.module';
import { formsStateMock } from '@shared/testing/mocks';

import { OrganismsTaskDialogComponent } from './organisms-task-dialog.component';

describe('OrganismsTaskDialogComponent', () => {
  const dialogDataModel: DialogDataModel<DialogCreateEditModel> = {
    dialogModel: new DialogCreateEditModel(DIALOG_MODE.CREATE)
  };

  let component: OrganismsTaskDialogComponent;
  let fixture: ComponentFixture<OrganismsTaskDialogComponent>;
  const initialState = {
    forms: formsStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsTaskDialogComponent],
        imports: [HttpClientModule, SharedModule, BrowserAnimationsModule, RouterTestingModule],
        providers: [provideMockStore({ initialState }), { provide: MAT_DIALOG_DATA, useValue: dialogDataModel }]
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
