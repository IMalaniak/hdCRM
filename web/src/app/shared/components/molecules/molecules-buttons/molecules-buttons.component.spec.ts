import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoleculesButtonsComponent } from './molecules-buttons.component';

describe('MoleculesButtonsComponent', () => {
  let component: MoleculesButtonsComponent;
  let fixture: ComponentFixture<MoleculesButtonsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MoleculesButtonsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
