import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsTaskDialogComponent } from './organisms-task-dialog.component';

describe('OrganismsTaskDialogComponent', () => {
  let component: OrganismsTaskDialogComponent;
  let fixture: ComponentFixture<OrganismsTaskDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsTaskDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
