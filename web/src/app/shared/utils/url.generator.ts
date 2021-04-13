import { RoutingConstants } from '../constants/routing.constants';
import { Navigation } from '../models';

import { createNavigation } from './createNavigation';

export class UrlGenerator {
  static getUserUrl(id: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_USERS_DETAILS}/${id}`]);
  }

  static getDepartmentUrl(id: number): Navigation {
    return createNavigation([`/${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
  }
}
