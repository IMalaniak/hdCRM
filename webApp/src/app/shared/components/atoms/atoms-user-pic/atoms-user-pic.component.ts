import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Asset } from '@/shared/models';
import { environment } from 'environments/environment';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img src="{{ src }}" alt="{{ title }}" [hidden]="isLoading" (load)="isLoading = false" />
    <span *ngIf="!isLoading" class="user-status-icon" [ngClass]="{ 'bg-success': userOnline }"></span>
    <mat-spinner *ngIf="isLoading" [diameter]="35" [strokeWidth]="2"></mat-spinner>
  `,
  styleUrls: ['./atoms-user-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsUserPicComponent implements OnInit {
  @Input() avatar: Asset = null;

  @Input() userOnline: false;

  baseUrl = environment.baseUrl;
  src = './assets/images/userpic/noimage_croped.png';
  title = 'noimage';
  isLoading = true;

  ngOnInit(): void {
    if (!!this.avatar) {
      this.src = this.baseUrl + this.avatar.location + '/thumbnails/' + this.avatar.title;
      this.title = this.avatar.title;
    }
  }
}
