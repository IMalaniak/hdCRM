import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsTaskListComponent } from './organisms-task-list.component';

describe('OrganismsTaskListComponent', () => {
  let component: OrganismsTaskListComponent;
  let fixture: ComponentFixture<OrganismsTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsTaskListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
