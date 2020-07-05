import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserDetailsComponent } from './organisms-user-details.component';

describe('OrganismsUserDetailsComponent', () => {
  let component: OrganismsUserDetailsComponent;
  let fixture: ComponentFixture<OrganismsUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
