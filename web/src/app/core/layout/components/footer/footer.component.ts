import { Component, ChangeDetectionStrategy } from '@angular/core';

import { IconsService } from '@/core/services';
import { ICONS } from '@/shared/constants';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  socialIcons = {
    email: ICONS.SOCIAL_Email,
    fb: ICONS.SOCIAL_Facebook,
    ig: ICONS.SOCIAL_Instagram,
    linkedIn: ICONS.SOCIAL_LinkedIn,
    tw: ICONS.SOCIAL_Twitter,
    telegram: ICONS.SOCIAL_Telegram
  };
  constructor(private iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.socialIcons)]);
  }
}
