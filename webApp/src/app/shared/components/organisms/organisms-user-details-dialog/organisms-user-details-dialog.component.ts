import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@/modules/users';
import { Router } from '@angular/router';

@Component({
  selector: 'organisms-user-details-dialog',
  templateUrl: './organisms-user-details-dialog.component.html'
})
export class OrganismsUserDetailsDialogComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<OrganismsUserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit(): void {
    this.user = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  navigateToUser(): void {
    this.onNoClick();
    this.router.navigate([`/users/details/${this.user.id}`]);
  }
}
