import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesAttachmentsListComponent } from './templates-attachments-list.component';

describe('TemplatesAttachmentsListComponent', () => {
  let component: TemplatesAttachmentsListComponent;
  let fixture: ComponentFixture<TemplatesAttachmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesAttachmentsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesAttachmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
