import { LINK_TYPE, LINK_TARGET } from '../constants';

export interface Navigation {
  linkHref: any[] | string;
  linkType: LINK_TYPE;
  target: LINK_TARGET;
}
