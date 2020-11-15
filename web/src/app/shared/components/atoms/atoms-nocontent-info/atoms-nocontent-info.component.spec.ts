import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsNocontentInfoComponent } from './atoms-nocontent-info.component';

describe('AtomsNocontentInfoComponent', () => {
  let component: AtomsNocontentInfoComponent;
  let fixture: ComponentFixture<AtomsNocontentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsNocontentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsNocontentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
