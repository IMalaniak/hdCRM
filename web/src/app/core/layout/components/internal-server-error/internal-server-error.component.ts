import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BS_ICONS, THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'app-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalServerErrorComponent {
  themePalette = THEME_PALETTE;
  arrow: BS_ICONS.ArrowLeft;
}
