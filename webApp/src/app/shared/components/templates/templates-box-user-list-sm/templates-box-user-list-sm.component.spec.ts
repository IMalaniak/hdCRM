import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesBoxUserListSmComponent } from './templates-box-user-list-sm.component';

describe('TemplatesBoxUserListSmComponent', () => {
  let component: TemplatesBoxUserListSmComponent;
  let fixture: ComponentFixture<TemplatesBoxUserListSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesBoxUserListSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesBoxUserListSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
