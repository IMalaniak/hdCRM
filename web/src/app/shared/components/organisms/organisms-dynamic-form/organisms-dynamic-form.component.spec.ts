import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsDynamicFormComponent } from './organisms-dynamic-form.component';

describe('OrganismsDynamicFormComponent', () => {
  let component: OrganismsDynamicFormComponent;
  let fixture: ComponentFixture<OrganismsDynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismsDynamicFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
