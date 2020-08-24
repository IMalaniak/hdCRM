import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesServerMessageComponent } from './molecules-server-message.component';

describe('MoleculesServerMessageComponent', () => {
  let component: MoleculesServerMessageComponent;
  let fixture: ComponentFixture<MoleculesServerMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoleculesServerMessageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesServerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
