import { Component, ChangeDetectionStrategy } from '@angular/core';

import { IconsService } from '@core/services';
import { ICON } from '@shared/constants';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  socialIcons = {
    email: ICON.SOCIAL_Email,
    fb: ICON.SOCIAL_Facebook,
    ig: ICON.SOCIAL_Instagram,
    linkedIn: ICON.SOCIAL_LinkedIn,
    tw: ICON.SOCIAL_Twitter,
    telegram: ICON.SOCIAL_Telegram
  };
  constructor(private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.socialIcons)]);
  }
}
