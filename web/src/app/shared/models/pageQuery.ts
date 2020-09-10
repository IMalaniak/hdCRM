import { SortDirection } from '@angular/material/sort';

export interface PageQuery {
  pageIndex: number;
  pageSize: number;
  sortIndex: string;
  sortDirection: SortDirection;
}
