import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsIconButtonComponent } from './atoms-icon-button.component';

describe('AtomsIconButtonComponent', () => {
  let component: AtomsIconButtonComponent;
  let fixture: ComponentFixture<AtomsIconButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomsIconButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
