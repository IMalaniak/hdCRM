import { SharedModule } from '@/shared/shared.module';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesBoxUserListSmComponent } from './templates-box-user-list-sm.component';

describe('TemplatesBoxUserListSmComponent', () => {
  let component: TemplatesBoxUserListSmComponent;
  let fixture: ComponentFixture<TemplatesBoxUserListSmComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesBoxUserListSmComponent],
        imports: [SharedModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesBoxUserListSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
