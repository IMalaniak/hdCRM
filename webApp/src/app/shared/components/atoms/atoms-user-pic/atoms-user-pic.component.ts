import { Component, Input, HostBinding, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Asset } from '@/shared/models';
import { environment } from 'environments/environment';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img class="userpic" src="{{ src }}" alt="{{ title }}" />
    <span class="user-status-icon" [ngClass]="{ 'bg-success': userOnline }"></span>
  `,
  styleUrls: ['./atoms-user-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsUserPicComponent implements OnInit {
  @Input() avatar: Asset = null;
  @Input() userOnline: false;

  @HostBinding('class.position-relative') posRelative = true;

  baseUrl = environment.baseUrl;
  src = './assets/images/userpic/noimage_croped.png';
  title = 'noimage';

  ngOnInit(): void {
    if (!!this.avatar) {
      this.src = this.baseUrl + this.avatar.location + '/thumbnails/' + this.avatar.title;
      this.title = this.avatar.title;
    }
  }
}
