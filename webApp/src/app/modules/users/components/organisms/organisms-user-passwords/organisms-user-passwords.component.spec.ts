import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserPasswordsComponent } from './organisms-user-passwords.component';

describe('OrganismsUserPasswordsComponent', () => {
  let component: OrganismsUserPasswordsComponent;
  let fixture: ComponentFixture<OrganismsUserPasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsUserPasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
