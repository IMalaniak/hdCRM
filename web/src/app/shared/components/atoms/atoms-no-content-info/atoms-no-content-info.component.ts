import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonConstants } from '@/shared/constants';

@Component({
  selector: 'atoms-no-content-info',
  template: ` <p class="lead p-4 mb-0 text-center">{{ noContentMessage }}</p> `,
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
  @Input() noContentMessage = CommonConstants.NO_CONTENT_INFO;
}
