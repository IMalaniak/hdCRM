import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Asset } from '@/shared/models';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img class="userpic" src="{{ src }}" alt="{{ alt }}" />
    <span class="user-status-icon" [ngClass]="{ 'bg-success': userOnline }"></span>
  `,
  styleUrls: ['./atoms-user-pic.component.scss']
})
export class AtomsUserPicComponent implements OnInit {
  @Input() avatar: Asset = null;
  @Input() userOnline: false;
  src = './assets/images/userpic/noimage_croped.png';
  alt = 'noimage';

  @HostBinding('class.position-relative') posRelative = true;

  constructor() {}

  ngOnInit(): void {
    if (!!this.avatar) {
      this.src = this.avatar.getThumbnailsUrl;
      this.alt = this.avatar.title;
    }
  }
}
