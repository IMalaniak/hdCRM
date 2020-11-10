import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesDepartmentViewComponent } from './templates-department-view.component';

describe('TemplatesDepartmentViewComponent', () => {
  let component: TemplatesDepartmentViewComponent;
  let fixture: ComponentFixture<TemplatesDepartmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatesDepartmentViewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesDepartmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
