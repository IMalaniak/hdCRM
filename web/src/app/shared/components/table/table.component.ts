import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkTable } from '@angular/cdk/table';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { DataColumn } from '@/shared/models/table/data-column.model';
import { DataRow } from '@/shared/models/table/data-row';
import { IconsService } from '@/core/services';
import {
  BS_ICONS,
  BUTTON_TYPE,
  COLUMN_NAMES,
  CONSTANTS,
  MAT_BUTTON,
  STYLECONSTANTS,
  THEME_PALETTE
} from '@/shared/constants';
import { HorizontalAlign } from '@/shared/models/table/horizontalAlign.enum';
import { CellActionType, CellControlType, CellValueType } from '@/shared/models/table';
import { CustomActionEvent } from '@/shared/models/table/custom-action-event';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() columns: DataColumn[];
  @Input() rows: DataRow[];
  @Input() paging: any; // TODO: add type
  @Input() sorting: any; // TODO: add type
  @Input() canSort = true;
  @Input() hasSettings = true;
  @Input() noContentMessage = CONSTANTS.NO_CONTENT_INFO;
  @Input() hasOutlineBorder = true; // TODO: add logic to set it based on user preference

  @Output() readonly pagingChange: EventEmitter<any> = new EventEmitter<any>(); // TODO: add type
  @Output() readonly sortingChange: EventEmitter<any> = new EventEmitter<any>(); // TODO: add type
  @Output() readonly filteringChange: EventEmitter<any> = new EventEmitter<any>(); // TODO: add type
  @Output() readonly editClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly deleteClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly detailsClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly customActionClicked: EventEmitter<CustomActionEvent> = new EventEmitter<CustomActionEvent>();

  @ViewChild('table') table: MatTable<CdkTable<DataRow>>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<DataRow> = new MatTableDataSource<DataRow>();
  columnsToDisplay: string[] = [];
  menuColumnName = COLUMN_NAMES.NAME;

  cellValueType = CellValueType;
  cellControlType = CellControlType;
  buttonType = BUTTON_TYPE;
  matButtonType = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  columnActions = COLUMN_NAMES.ACTIONS;

  icons: { [key: string]: BS_ICONS } = {
    checksGrid: BS_ICONS.UiChecksGrid,
    threeDots: BS_ICONS.ThreeDotsVertical,
    checkCircle: BS_ICONS.CheckCircle,
    xCircle: BS_ICONS.XCircle,
    'info-square': BS_ICONS.InfoSquare,
    pencil: BS_ICONS.Pencil,
    trash: BS_ICONS.Trash,
    list: BS_ICONS.List,
    gear: BS_ICONS.Gear,
    arrowClock: BS_ICONS.ArrowClockwise,
    gripVertival: BS_ICONS.GripVertical
  };

  constructor(private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.icons)]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns && this.columns) {
      this.setColumns();
    }

    if (changes.rows && this.rows) {
      this.dataSource.data = this.rows;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  actionClicked(action: CellActionType, id: number, event: Event | MatCheckboxChange): void {
    if (event instanceof Event) {
      event.stopImmediatePropagation();
    }

    switch (action) {
      case CellActionType.Details:
        this.detailsClicked.emit(id);
        break;
      case CellActionType.Edit:
        this.editClicked.emit(id);
        break;
      case CellActionType.Delete:
        this.deleteClicked.emit(id);
        break;
      default:
        this.customActionClicked.emit({ action, id, event });
        break;
    }
  }

  trackById(_index: number, item: any): void {
    return item.id;
  }

  getSequenceNumber(index: number): number {
    if (this.paging) {
      // return index + (this.paging.number - 1) * this.paging.perPage;
    } // TODO: add logic
    return index;
  }

  getColumnClasses(align: HorizontalAlign, customClass?: string): string {
    let resultClasses: string;

    switch (align) {
      case HorizontalAlign.Left:
        resultClasses = STYLECONSTANTS.TEXT_LEFT;
        break;
      case HorizontalAlign.Center:
        resultClasses = STYLECONSTANTS.TEXT_CENTER;
        break;
      case HorizontalAlign.Right:
        resultClasses = STYLECONSTANTS.TEXT_RIGHT;
        break;
      default:
        resultClasses = STYLECONSTANTS.TEXT_LEFT;
        break;
    }

    if (customClass && customClass !== '') {
      resultClasses += ` ${customClass}`;
    }

    return resultClasses.trim();
  }

  getActionsStickyBorders(title: string): string {
    if (title === COLUMN_NAMES.ACTIONS && this.hasOutlineBorder) {
      return STYLECONSTANTS.STICKY_WITH_BORDER;
    }
    return '';
  }

  getHiddenColumnsCount(): number {
    return this.columns.filter((c) => !c.isVisible).length;
  }

  hasHiddenColumn(): boolean {
    return this.columns.filter((c) => !c.isVisible).length > 0;
  }

  private setColumns(): void {
    if (this.columns) {
      let columnsToDisplay: string[] = this.columns.filter((c) => c.isVisible).map((c) => c.title);
      const hasActionColumn: boolean = this.columns.some((c) => c.title === COLUMN_NAMES.ACTIONS);

      if (this.hasSettings && !hasActionColumn) {
        columnsToDisplay = [...columnsToDisplay, this.menuColumnName];
      }

      this.columnsToDisplay = [...this.columnsToDisplay, ...columnsToDisplay];
    }
  }
}
