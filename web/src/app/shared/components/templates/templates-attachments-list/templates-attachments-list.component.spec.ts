import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@/shared/shared.module';
import { TemplatesAttachmentsListComponent } from './templates-attachments-list.component';

describe('TemplatesAttachmentsListComponent', () => {
  let component: TemplatesAttachmentsListComponent;
  let fixture: ComponentFixture<TemplatesAttachmentsListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesAttachmentsListComponent],
        imports: [HttpClientModule, MatIconTestingModule, SharedModule],
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
