import { ROUTING } from '../constants/routing.constants';
import { Navigation } from '../models';
import { createNavigation } from './createNavigation';

export class UrlGenerator {
  static getUserUrl(id: number): Navigation {
    return createNavigation([`/${ROUTING.ROUTE_USERS_DETAILS}/${id}`]);
  }

  static getDepartmentUrl(id: number): Navigation {
    return createNavigation([`/${ROUTING.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
  }
}
