import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CONSTANTS } from '@/shared/constants';

@Component({
  selector: 'atoms-no-content-info',
  template: ` <p class="lead p-4 mb-0 text-center">{{ noContentInfo }}</p> `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsNoContentInfoComponent {
  noContentInfo = CONSTANTS.NO_CONTENT_INFO;
}
