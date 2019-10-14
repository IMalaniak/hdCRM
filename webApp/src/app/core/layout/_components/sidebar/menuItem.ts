import { Observable } from 'rxjs';

export class MenuItem {
    url: string[];
    icon: string[];
    i18n: string;
    title: string;
    privilege?: Observable<boolean>;
    disable?: boolean;
    children?: MenuItem[];
}
