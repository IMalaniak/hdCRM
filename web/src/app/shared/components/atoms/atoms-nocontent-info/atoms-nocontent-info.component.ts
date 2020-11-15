import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CONSTANTS } from '@/shared/constants';

@Component({
  selector: 'atoms-nocontent-info',
  template: `
    <section content class="no-content">
      <p class="lead p-4 text-center" i18n="@@attachmentsComponentNoContentInfo">{{ noContentInfo }}</p>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsNocontentInfoComponent {
  noContentInfo = CONSTANTS.NO_CONTENT_INFO;
}
