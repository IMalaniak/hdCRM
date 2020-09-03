import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesChartComponent } from './molecules-chart.component';

describe('MoleculesChartComponent', () => {
  let component: MoleculesChartComponent;
  let fixture: ComponentFixture<MoleculesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoleculesChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
