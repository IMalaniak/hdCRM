import { Component, Input, HostBinding } from '@angular/core';
import { Asset } from '@/shared/models';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img class="userpic" src="{{ avatar ? avatar.getThumbnailsUrl : './assets/images/userpic/noimage_croped.png' }}" alt="{{ avatar ? avatar.title : 'noimage' }}" />
    <span class="user-status-icon" [ngClass]="{ 'bg-success': userOnline }"></span>
  `,
  styleUrls: ['./atoms-user-pic.component.scss']
})
export class AtomsUserPicComponent  {
  @Input() avatar: Asset = null;
  @Input() userOnline: false;

  @HostBinding('class.position-relative') posRelative = true;
}
