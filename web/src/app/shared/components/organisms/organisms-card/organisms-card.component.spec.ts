import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsCardComponent } from './organisms-card.component';

describe('OrganismsCardComponent', () => {
  let component: OrganismsCardComponent;
  let fixture: ComponentFixture<OrganismsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
