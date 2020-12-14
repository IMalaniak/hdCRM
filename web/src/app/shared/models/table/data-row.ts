import { CellValue } from './cell-value.model';

export interface DataRow {
  id: number;
  [key: string]: CellValue | number;
}
