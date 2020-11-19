import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialUsersState } from '../../store/user.reducer';
import { InvitationDialogComponent } from './invitation-dialog.component';
import { SharedModule } from '@/shared/shared.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogCreateEditModel, DialogMode } from '@/shared/models';

describe('InvitationDialogComponent', () => {
  const dialogDataModel: DialogDataModel<DialogCreateEditModel> = {
    dialogModel: new DialogCreateEditModel(DialogMode.CREATE)
  };

  let component: InvitationDialogComponent;
  let fixture: ComponentFixture<InvitationDialogComponent>;
  const initialState = {
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvitationDialogComponent],
        imports: [BrowserAnimationsModule, SharedModule, RouterTestingModule],
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
