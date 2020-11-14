import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogConfirmComponent } from './dialog-confirm.component';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';

describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent<DialogConfirmModel>;
  let fixture: ComponentFixture<DialogConfirmComponent<DialogConfirmModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogConfirmComponent],
      providers: [MatDialog, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
