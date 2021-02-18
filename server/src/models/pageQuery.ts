export interface ParsedFilters {
  [key: string]: string | number | boolean | Date | ParsedFilters;
}
export interface PageQuery {
  limit: number;
  offset: number;
  sortIndex: string;
  sortDirection: string;
  parsedFilters: ParsedFilters;
}
