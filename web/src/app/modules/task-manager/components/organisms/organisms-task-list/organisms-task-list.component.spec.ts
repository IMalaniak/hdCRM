import { SharedModule } from '@/shared/shared.module';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

import { OrganismsTaskListComponent } from './organisms-task-list.component';

describe('OrganismsTaskListComponent', () => {
  let component: OrganismsTaskListComponent;
  let fixture: ComponentFixture<OrganismsTaskListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsTaskListComponent],
        imports: [BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({})]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
