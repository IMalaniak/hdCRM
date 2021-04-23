import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'environments/environment';

import { CommonConstants } from '@shared/constants';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img src="{{ src }}" [hidden]="imageIsLoading" (load)="imageIsLoading = false" />
    <span *ngIf="!imageIsLoading" class="user-status-icon" [ngClass]="{ 'bg-accent': userOnline }"></span>
    <mat-spinner *ngIf="imageIsLoading" [diameter]="35" [strokeWidth]="2"></mat-spinner>
  `,
  styleUrls: ['./atoms-user-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsUserPicComponent implements OnInit {
  @Input() picture: string = null;

  @Input() userOnline = false;

  baseUrl = environment.baseUrl;
  src = CommonConstants.NO_IMAGE_URL;
  title = CommonConstants.NO_IMAGE_TITLE;
  imageIsLoading = true;

  ngOnInit(): void {
    if (!!this.picture) {
      this.src = this.picture;
    }
  }
}
