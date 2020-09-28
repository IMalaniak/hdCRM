import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { TemplatesAttachmentsListComponent } from './templates-attachments-list.component';

describe('TemplatesAttachmentsListComponent', () => {
  let component: TemplatesAttachmentsListComponent;
  let fixture: ComponentFixture<TemplatesAttachmentsListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesAttachmentsListComponent],
        imports: [HttpClientModule],
        providers: [provideMockStore({})]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesAttachmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
