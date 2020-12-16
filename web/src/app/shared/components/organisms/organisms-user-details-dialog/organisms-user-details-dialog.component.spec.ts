import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { OrganismsUserDetailsDialogComponent } from './organisms-user-details-dialog.component';
import { DialogWithTwoButtonModel } from '@/shared/models';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { SharedModule } from '@/shared/shared.module';

describe('OrganismsUserDetailsDialogComponent', () => {
  const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
    dialogModel: new DialogWithTwoButtonModel()
  };

  let component: OrganismsUserDetailsDialogComponent;
  let fixture: ComponentFixture<OrganismsUserDetailsDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, RouterTestingModule],
        declarations: [OrganismsUserDetailsDialogComponent],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: dialogDataModel
          },
          provideMockStore()
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
