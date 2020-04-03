import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesUserProfilePageComponent } from './templates-user-profile-page.component';

describe('TemplatesUserProfilePageComponent', () => {
  let component: TemplatesUserProfilePageComponent;
  let fixture: ComponentFixture<TemplatesUserProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesUserProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
