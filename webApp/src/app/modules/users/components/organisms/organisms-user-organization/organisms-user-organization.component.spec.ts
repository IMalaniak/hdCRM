import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserOrganizationComponent } from './organisms-user-organization.component';

describe('OrganismsUserOrganizationComponent', () => {
  let component: OrganismsUserOrganizationComponent;
  let fixture: ComponentFixture<OrganismsUserOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsUserOrganizationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
