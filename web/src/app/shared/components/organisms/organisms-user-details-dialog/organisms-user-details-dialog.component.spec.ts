import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '@/modules/users';
import { DialogWithTwoButtonModel } from '@/shared/models';
import { OrganismsUserDetailsDialogComponent } from './organisms-user-details-dialog.component';

describe('OrganismsUserDetailsDialogComponent', () => {
  let component: OrganismsUserDetailsDialogComponent<DialogWithTwoButtonModel, User>;
  let fixture: ComponentFixture<OrganismsUserDetailsDialogComponent<DialogWithTwoButtonModel, User>>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserDetailsDialogComponent],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
