import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { DialogBaseComponent } from './dialog-base.component';
import { DialogWithTwoButtonModel } from '@/shared/models';

describe('DialogBaseComponent', () => {
  let component: DialogBaseComponent<DialogWithTwoButtonModel>;
  let fixture: ComponentFixture<DialogBaseComponent<DialogWithTwoButtonModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogBaseComponent],
      imports: [RouterTestingModule],
      providers: [MatDialog, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
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
});
