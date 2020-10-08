import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmComponent } from './dialog-confirm.component';
import { BaseModel } from '@/shared/models/base';
import { DialogConfirmModal } from '@/shared/models/modal/dialog-question.model';

describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent<DialogConfirmModal, BaseModel>;
  let fixture: ComponentFixture<DialogConfirmComponent<DialogConfirmModal, BaseModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogConfirmComponent]
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
