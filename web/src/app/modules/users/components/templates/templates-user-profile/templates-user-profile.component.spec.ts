import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesUserProfileComponent } from './templates-user-profile.component';

describe('TemplatesUserProfileComponent', () => {
  let component: TemplatesUserProfileComponent;
  let fixture: ComponentFixture<TemplatesUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesUserProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
