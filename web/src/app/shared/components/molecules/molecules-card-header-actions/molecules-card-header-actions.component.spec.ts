import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoleculesCardHeaderActionsComponent } from './molecules-card-header-actions.component';

describe('MoleculesCardHeaderActionsComponent', () => {
  let component: MoleculesCardHeaderActionsComponent;
  let fixture: ComponentFixture<MoleculesCardHeaderActionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MoleculesCardHeaderActionsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesCardHeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
