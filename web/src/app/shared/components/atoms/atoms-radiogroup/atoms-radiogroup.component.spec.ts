import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsRadiogroupComponent } from './atoms-radiogroup.component';

describe('AtomsRadiogroupComponent', () => {
  let component: AtomsRadiogroupComponent;
  let fixture: ComponentFixture<AtomsRadiogroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsRadiogroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsRadiogroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
