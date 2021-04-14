import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialUsersState } from '@core/modules/user-api/store';
import { DialogCreateEditModel, DIALOG_MODE } from '@shared/models';
import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';
import { SharedModule } from '@shared/shared.module';

import { InvitationDialogComponent } from './invitation-dialog.component';

describe('InvitationDialogComponent', () => {
  const dialogDataModel: DialogDataModel<DialogCreateEditModel> = {
    dialogModel: new DialogCreateEditModel(DIALOG_MODE.CREATE)
  };

  let component: InvitationDialogComponent;
  let fixture: ComponentFixture<InvitationDialogComponent>;
  const initialState = {
    'user-api': initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvitationDialogComponent],
        imports: [BrowserAnimationsModule, MatIconTestingModule, SharedModule, RouterTestingModule],
        providers: [provideMockStore({ initialState }), { provide: MAT_DIALOG_DATA, useValue: dialogDataModel }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
