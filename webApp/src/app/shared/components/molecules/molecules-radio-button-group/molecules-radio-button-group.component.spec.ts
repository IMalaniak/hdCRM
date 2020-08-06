import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesRadioButtonGroupComponent } from './molecules-radio-button-group.component';

describe('MoleculesRadioButtonGroupComponent', () => {
  let component: MoleculesRadioButtonGroupComponent;
  let fixture: ComponentFixture<MoleculesRadioButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculesRadioButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesRadioButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
