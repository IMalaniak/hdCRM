import { Component } from '@angular/core';
import { AtomsUserPicComponent } from '../atoms-user-pic/atoms-user-pic.component';

@Component({
  selector: 'atoms-profile-pic',
  template: `
  <img class="userpic" src="{{ avatar ? avatar.getUrl : './assets/images/userpic/noimage_croped.png' }}" alt="{{ avatar ? avatar.title : 'noimage' }}" />
  `,
  styleUrls: ['./atoms-profile-pic.component.scss']
})
export class AtomsProfilePicComponent extends AtomsUserPicComponent {
  constructor() {
    super();
  }
}
