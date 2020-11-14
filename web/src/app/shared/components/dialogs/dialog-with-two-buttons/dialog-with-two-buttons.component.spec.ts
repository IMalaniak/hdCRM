import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogWithTwoButtonModel } from '@/shared/models';
import { DialogWithTwoButtonsComponent } from './dialog-with-two-buttons.component';

describe('DialogWithTwoButtonsComponent', () => {
  let component: DialogWithTwoButtonsComponent<DialogWithTwoButtonModel>;
  let fixture: ComponentFixture<DialogWithTwoButtonsComponent<DialogWithTwoButtonModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogWithTwoButtonsComponent],
      providers: [MatDialog, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
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
