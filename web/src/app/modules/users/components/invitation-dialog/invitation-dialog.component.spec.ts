import { DialogCreateEditModel } from '@/shared/models';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';
import { initialUsersState } from '../../store/user.reducer';
import { InvitationDialogComponent } from './invitation-dialog.component';
import { SharedModule } from '@/shared/shared.module';
import { User } from '../../models/user';

describe('InvitationDialogComponent', () => {
  let component: InvitationDialogComponent<DialogCreateEditModel, User>;
  let fixture: ComponentFixture<InvitationDialogComponent<DialogCreateEditModel, User>>;
  const initialState = {
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvitationDialogComponent],
        imports: [BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
