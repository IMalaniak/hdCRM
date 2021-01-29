import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsTextareaComponent } from './atoms-textarea.component';

describe('AtomsTextareaComponent', () => {
  let component: AtomsTextareaComponent;
  let fixture: ComponentFixture<AtomsTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
