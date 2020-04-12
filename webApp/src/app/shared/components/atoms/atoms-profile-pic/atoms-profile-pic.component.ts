import { Component, OnInit } from '@angular/core';
import { AtomsUserPicComponent } from '../atoms-user-pic/atoms-user-pic.component';

@Component({
  selector: 'atoms-profile-pic',
  template: `
    <img class="userpic" src="{{ src }}" alt="{{ title }}" />
  `,
  styleUrls: ['./atoms-profile-pic.component.scss']
})
export class AtomsProfilePicComponent extends AtomsUserPicComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
    if (!!this.avatar) {
      this.src = this.baseUrl + this.avatar.location + '/' + this.avatar.title;
    }
  }
}
