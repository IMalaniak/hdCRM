import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@/modules/users';
import { THEME_PALETTE, MAT_BUTTON, RouteConstants } from '@/shared/constants';

@Component({
  selector: 'organisms-user-details-dialog',
  templateUrl: './organisms-user-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsDialogComponent implements OnInit {
  user: User;
  userDetailsRoute: string;

  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  constructor(
    public dialogRef: MatDialogRef<OrganismsUserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit(): void {
    this.user = this.data;
    this.userDetailsRoute = `${RouteConstants.ROUTE_USERS_DETAILS}/${this.user.id}`;
  }
}
