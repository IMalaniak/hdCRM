import { RoutingConstants } from '../constants/routing.constants';
import { createNavigation, Navigation } from '../models/table/navigation';

export class UrlGenerator {
  static getUserUrl(number: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_USERS_DETAILS}/${number}`]);
  }

  static getDepartmentUrl(number: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${number}`]);
  }
}
