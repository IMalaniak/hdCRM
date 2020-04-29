import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsDashboardCardComponent } from './organisms-dashboard-card.component';

describe('OrganismsDashboardCardComponent', () => {
  let component: OrganismsDashboardCardComponent;
  let fixture: ComponentFixture<OrganismsDashboardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsDashboardCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
