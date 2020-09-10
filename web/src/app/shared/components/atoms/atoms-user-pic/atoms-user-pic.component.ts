import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Asset } from '@/shared/models';
import { environment } from 'environments/environment';
import { NO_IMAGE, NO_IMAGE_TITLE } from '@/shared/constants';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img src="{{ src }}" alt="{{ title }}" [hidden]="imageIsLoading" (load)="imageIsLoading = false" />
    <span *ngIf="!imageIsLoading" class="user-status-icon" [ngClass]="{ 'bg-success': userOnline }"></span>
    <mat-spinner *ngIf="imageIsLoading" [diameter]="35" [strokeWidth]="2"></mat-spinner>
  `,
  styleUrls: ['./atoms-user-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsUserPicComponent implements OnInit {
  @Input() avatar: Asset = null;

  @Input() userOnline: false;

  baseUrl = environment.baseUrl;
  src = NO_IMAGE;
  title = NO_IMAGE_TITLE;
  imageIsLoading = true;

  ngOnInit(): void {
    if (!!this.avatar) {
      this.src = this.baseUrl + this.avatar.location + '/thumbnails/' + this.avatar.title;
      this.title = this.avatar.title;
    }
  }
}
