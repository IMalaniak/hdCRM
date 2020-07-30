import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsLinkButtonComponent } from './atoms-link-button.component';

describe('AtomsLinkButtonComponent', () => {
  let component: AtomsLinkButtonComponent;
  let fixture: ComponentFixture<AtomsLinkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomsLinkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
