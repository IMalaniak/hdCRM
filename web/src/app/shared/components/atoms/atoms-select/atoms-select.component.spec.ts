import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsSelectComponent } from './atoms-select.component';

describe('AtomsSelectComponent', () => {
  let component: AtomsSelectComponent;
  let fixture: ComponentFixture<AtomsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
