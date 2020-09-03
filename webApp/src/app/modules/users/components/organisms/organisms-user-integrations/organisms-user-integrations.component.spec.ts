import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserIntegrationsComponent } from './organisms-user-integrations.component';

describe('OrganismsUserIntegrationsComponent', () => {
  let component: OrganismsUserIntegrationsComponent;
  let fixture: ComponentFixture<OrganismsUserIntegrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsUserIntegrationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
