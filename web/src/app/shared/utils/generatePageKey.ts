import { PageQuery } from '../models';

export const generatePageKey = (pageQuery: PageQuery): string => {
  return Object.keys(pageQuery)
    .sort()
    .map((key) => pageQuery[key])
    .join();
};
