import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@/modules/users';

@Component({
  selector: 'organisms-user-details-dialog',
  templateUrl: './organisms-user-details-dialog.component.html'
})
export class OrganismsUserDetailsDialogComponent implements OnInit {
  user: User;

  constructor(
    public dialogRef: MatDialogRef<OrganismsUserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit(): void {
    this.user = this.data;
  }
}
