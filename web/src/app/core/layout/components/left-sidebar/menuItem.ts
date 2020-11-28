import { BS_ICONS } from '@/shared/constants';
import { Observable } from 'rxjs';

export class MenuItem {
  url: string;
  icon: BS_ICONS;
  i18n: string;
  title: string;
  privilege?: Observable<boolean>;
  disable?: boolean;
  children?: MenuItem[];
}
