import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesUserDetailsComponent } from './templates-user-details.component';

describe('TemplatesUserDetailsComponent', () => {
  let component: TemplatesUserDetailsComponent;
  let fixture: ComponentFixture<TemplatesUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesUserDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
