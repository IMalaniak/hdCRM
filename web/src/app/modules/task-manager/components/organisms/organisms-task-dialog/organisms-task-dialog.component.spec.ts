import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OrganismsTaskDialogComponent } from './organisms-task-dialog.component';
import { SharedModule } from '@/shared/shared.module';
import { DialogCreateEditModel } from '@/shared/models';
import { TaskDialogData } from '@/modules/task-manager/models';

describe('OrganismsTaskDialogComponent', () => {
  let component: OrganismsTaskDialogComponent<DialogCreateEditModel, TaskDialogData>;
  let fixture: ComponentFixture<OrganismsTaskDialogComponent<DialogCreateEditModel, TaskDialogData>>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsTaskDialogComponent],
        imports: [SharedModule, BrowserAnimationsModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
