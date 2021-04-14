import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { SharedModule } from '@shared/shared.module';
import { currentUserMock } from '@shared/testing/mocks';

import { MoleculesUserListSmItemComponent } from './molecules-user-list-sm-item.component';

@Component({
  template: ` <mat-selection-list #userList [multiple]="false" class="pt-0">
    <molecules-user-list-sm-item [editMode]="editMode" [user]="user"></molecules-user-list-sm-item>
  </mat-selection-list>`
})
export class TestWrapperComponent {
  user = currentUserMock;
  editMode = false;
}

describe('MoleculesUserListSmItemComponent', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, MatIconTestingModule],
        declarations: [MoleculesUserListSmItemComponent, TestWrapperComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
