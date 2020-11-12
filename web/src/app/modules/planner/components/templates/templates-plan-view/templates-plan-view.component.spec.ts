import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesPlanViewComponent } from './templates-plan-view.component';

describe('TemplatesPlanViewComponent', () => {
  let component: TemplatesPlanViewComponent;
  let fixture: ComponentFixture<TemplatesPlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatesPlanViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
