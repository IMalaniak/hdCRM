import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesErrorMessageComponent } from './molecules-error-message.component';

describe('MoleculesErrorMessageComponent', () => {
  let component: MoleculesErrorMessageComponent;
  let fixture: ComponentFixture<MoleculesErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculesErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
