import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserPreferencesComponent } from './organisms-user-preferences.component';

describe('OrganismsUserPreferencesComponent', () => {
  let component: OrganismsUserPreferencesComponent;
  let fixture: ComponentFixture<OrganismsUserPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsUserPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
