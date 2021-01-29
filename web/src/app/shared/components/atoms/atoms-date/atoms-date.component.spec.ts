import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsDateComponent } from './atoms-date.component';

describe('AtomsDateComponent', () => {
  let component: AtomsDateComponent;
  let fixture: ComponentFixture<AtomsDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
