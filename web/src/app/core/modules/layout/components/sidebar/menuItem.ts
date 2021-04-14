import { Observable } from 'rxjs';

import { BS_ICON } from '@shared/constants';

export class MenuItem {
  url: string;
  icon: BS_ICON;
  i18n: string;
  title: string;
  privilege?: Observable<boolean>;
  disable?: boolean;
  children?: MenuItem[];
}
