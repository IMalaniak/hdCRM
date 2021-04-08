import { ROUTING } from '../constants/routing.constants';
import { createNavigation, Navigation } from './navigation';

export class UrlGenerator {
  static getUserUrl(id: number): Navigation {
    return createNavigation([`/${ROUTING.ROUTE_USERS_DETAILS}/${id}`]);
  }

  static getDepartmentUrl(id: number): Navigation {
    return createNavigation([`/${ROUTING.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
  }
}
