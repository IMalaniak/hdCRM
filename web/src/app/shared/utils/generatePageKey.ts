import { PageQuery } from '../models';

export const generatePageKey = (pageQuery: PageQuery): string => Object.keys(pageQuery)
    .sort()
    .map((key) => pageQuery[key])
    .join();
