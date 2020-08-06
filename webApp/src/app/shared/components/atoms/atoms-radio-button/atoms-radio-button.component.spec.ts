import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsRadioButtonComponent } from './atoms-radio-button.component';

describe('AtomsRadioButtonComponent', () => {
  let component: AtomsRadioButtonComponent;
  let fixture: ComponentFixture<AtomsRadioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomsRadioButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
