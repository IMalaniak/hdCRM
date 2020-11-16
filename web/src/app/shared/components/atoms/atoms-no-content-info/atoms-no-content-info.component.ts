import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

import { CONSTANTS } from '@/shared/constants';

@Component({
  selector: 'atoms-no-content-info, [atoms-no-content-info]',
  template: `
    <td colspan="100" *ngIf="wrap; else unwrapped">
      <ng-content *ngTemplateOutlet="unwrapped"> </ng-content>
    </td>
    <ng-template #unwrapped>
      <p class="lead p-4 text-center">{{ noContentInfo }}</p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsNoContentInfoComponent {
  @Input() wrap: boolean;
  @HostBinding('class.d-block') get displayBlock(): boolean {
    return !this.wrap;
  }
  noContentInfo = CONSTANTS.NO_CONTENT_INFO;
}
