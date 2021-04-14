import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';
import { DialogWithTwoButtonModel } from '@shared/models/dialog/dialog-with-two-button.model';
import { SharedModule } from '@shared/shared.module';

import { DialogWithTwoButtonsComponent } from './dialog-with-two-buttons.component';

describe('DialogWithTwoButtonsComponent', () => {
  const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
    dialogModel: new DialogWithTwoButtonModel()
  };

  let component: DialogWithTwoButtonsComponent;
  let fixture: ComponentFixture<DialogWithTwoButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
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

  it('should emit true when OK has been clicked', () => {
    component.dialogClose.subscribe((dialogClose: boolean) => expect(dialogClose).toBe(true));
    component.onOkButtonClick();
  });

  it('should emit false when CANCEL has been clicked', () => {
    component.dialogClose.subscribe((dialogClose: boolean) => expect(dialogClose).toBe(false));
    component.onCancelButtonClick();
  });

  it('should emit true when keyboard enter has been clicked', () => {
    component.dialogClose.subscribe((dialogClose: boolean) => expect(dialogClose).toBe(true));

    const event = new KeyboardEvent('keyup', {
      key: 'Enter',
      cancelable: true
    });

    window.dispatchEvent(event);
  });
});
