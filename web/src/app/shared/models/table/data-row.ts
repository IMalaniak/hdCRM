import { ICell } from './cell.model';

export interface DataRow {
  id: number;
  [key: string]: ICell | number;
}
