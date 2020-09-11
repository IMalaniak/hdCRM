import { Component, ChangeDetectionStrategy } from '@angular/core';
import { THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {
  themePalette = THEME_PALETTE;
}
