import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogWithTwoButtonsComponent } from './dialog-with-two-buttons.component';
import { DialogWithTwoButtonModel } from '@/shared/models/dialog/dialog-with-two-button.model';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';

describe('DialogWithTwoButtonsComponent', () => {
  const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
    dialogModel: new DialogWithTwoButtonModel()
  };

  let component: DialogWithTwoButtonsComponent;
  let fixture: ComponentFixture<DialogWithTwoButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogWithTwoButtonsComponent],
      providers: [
        MatDialog,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataModel }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithTwoButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
