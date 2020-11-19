import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { DialogBaseComponent } from './dialog-base.component';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogWithTwoButtonModel } from '@/shared/models/dialog/dialog-with-two-button.model';

describe('DialogBaseComponent', () => {
  const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
    dialogModel: new DialogWithTwoButtonModel()
  };

  let component: DialogBaseComponent;
  let fixture: ComponentFixture<DialogBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogBaseComponent],
      imports: [RouterTestingModule],
      providers: [
        MatDialog,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataModel }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false when keyboard Escape has been clicked', () => {
    component.dialogClose.subscribe((dialogClose: boolean) => expect(dialogClose).toBe(false));

    const event = new KeyboardEvent('keyup', {
      key: 'Escape',
      cancelable: true
    });

    window.dispatchEvent(event);
  });
});
