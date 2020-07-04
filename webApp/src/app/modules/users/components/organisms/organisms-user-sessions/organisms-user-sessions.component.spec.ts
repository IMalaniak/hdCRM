import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserSessionsComponent } from './organisms-user-sessions.component';

describe('OrganismsUserSessionsComponent', () => {
  let component: OrganismsUserSessionsComponent;
  let fixture: ComponentFixture<OrganismsUserSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsUserSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
