import { RoutingConstants } from '../constants/routing.constants';
import { createNavigation, Navigation } from './navigation';

export class UrlGenerator {
  static getUserUrl(id: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_USERS_DETAILS}/${id}`]);
  }

  static getDepartmentUrl(id: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
  }
}
