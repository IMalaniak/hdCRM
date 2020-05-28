import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesEditableFieldComponent } from './molecules-editable-field.component';

describe('MoleculesEditableFieldComponent', () => {
  let component: MoleculesEditableFieldComponent;
  let fixture: ComponentFixture<MoleculesEditableFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculesEditableFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesEditableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
