import { LINK_TARGET, LINK_TYPE } from '@/shared/constants';

import { Navigation } from '../models';

export const createNavigation = (
  linkHref: any[] | string,
  linkType: LINK_TYPE = LINK_TYPE.ROUTER,
  target?: LINK_TARGET
): Navigation => {
  if (linkType === LINK_TYPE.LINK && !target) {
    target = LINK_TARGET.BLANK;
  } else if (!target) {
    target = LINK_TARGET.SELF;
  }

  return { linkHref, linkType, target };
};
