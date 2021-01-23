export interface TableColumnConfig {
  title: string;
  isVisible: boolean;
}

export interface TableConfig {
  key: string;
  outlineBorders: boolean;
  columns: TableColumnConfig[];
}
