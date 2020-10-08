import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithTwoButtonModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base';
import { DialogWithTwoButtonsComponent } from './dialog-with-two-buttons.component';

describe('DialogWithTwoButtonsComponent', () => {
  let component: DialogWithTwoButtonsComponent<DialogWithTwoButtonModel, BaseModel>;
  let fixture: ComponentFixture<DialogWithTwoButtonsComponent<DialogWithTwoButtonModel, BaseModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogWithTwoButtonsComponent]
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
