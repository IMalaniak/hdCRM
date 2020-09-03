import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsUserPicComponent } from './atoms-user-pic.component';

describe('AtomsUserPicComponent', () => {
  let component: AtomsUserPicComponent;
  let fixture: ComponentFixture<AtomsUserPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtomsUserPicComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsUserPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
