import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserListSmComponent } from './organisms-user-list-sm.component';

describe('OrganismsUserListSmComponent', () => {
  let component: OrganismsUserListSmComponent;
  let fixture: ComponentFixture<OrganismsUserListSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsUserListSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserListSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
