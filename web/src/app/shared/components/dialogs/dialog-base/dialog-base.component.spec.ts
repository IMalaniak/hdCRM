import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBaseComponent } from './dialog-base.component';
import { DialogWithTwoButtonModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base';

describe('DialogBaseComponent', () => {
  let component: DialogBaseComponent<DialogWithTwoButtonModel, BaseModel>;
  let fixture: ComponentFixture<DialogBaseComponent<DialogWithTwoButtonModel, BaseModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogBaseComponent]
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
