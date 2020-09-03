import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsUserDetailsDialogComponent } from './organisms-user-details-dialog.component';

describe('OrganismsUserDetailsDialogComponent', () => {
  let component: OrganismsUserDetailsDialogComponent;
  let fixture: ComponentFixture<OrganismsUserDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsUserDetailsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
