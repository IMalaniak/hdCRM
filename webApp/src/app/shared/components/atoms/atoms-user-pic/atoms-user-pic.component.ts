import { Component, OnInit, Input } from '@angular/core';
import { Asset } from '@/shared/models';

@Component({
  selector: 'atoms-user-pic',
  template: `
    <img class="userpic" src="{{ src }}" alt="{{ alt }}" />
  `,
  styleUrls: ['./atoms-user-pic.component.scss']
})
export class AtomsUserPicComponent implements OnInit {
  @Input() avatar: Asset = null;
  @Input() userOnline: false;
  src = './assets/images/userpic/noimage_croped.png';
  alt = 'noimage';

  constructor() {
  }

  ngOnInit(): void {
    if (!!this.avatar) {
      this.src = this.avatar.getThumbnailsUrl;
      this.alt = this.avatar.title;
    }
  }
}
