import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { initialPreferencesState } from '@/core/store/preferences';
import { AppState } from '@/core/store';
import { Cell, Column, DataRow, IColumn } from '@/shared/models/table';
import { SharedModule } from '@/shared/shared.module';
import { COLUMN_KEYS } from '@/shared/constants';
import { CommonDataSource } from '@/shared/services';
import { PageQuery } from '@/shared/models';
import { TableComponent } from './table.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

interface TestData {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const testData: TestData[] = [
  {
    id: 1,
    title: 'Test title',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
class TestDataSource extends CommonDataSource<TestData> {
  loadData(_: PageQuery) {
    this.listSubject.next(this.mapToDataRows(testData));
  }

  protected mapToDataRows(items: any[]): DataRow[] {
    return items.map((item: { id: any; title: string; createdAt: Date; updatedAt: Date }) => ({
      id: item.id,
      [COLUMN_KEYS.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEYS.TITLE]: Cell.createStringCell(item.title),
      [COLUMN_KEYS.CREATED_AT]: Cell.createDateCell(item.createdAt),
      [COLUMN_KEYS.UPDATED_AT]: Cell.createDateCell(item.updatedAt),
      [COLUMN_KEYS.ACTIONS]: Cell.createActionsCell()
    }));
  }
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const initialState = {
    preferences: initialPreferencesState
  };
  let store: MockStore;
  const columns: IColumn[] = [
    Column.createSequenceNumberColumn(),
    Column.createColumn({ key: COLUMN_KEYS.TITLE }),
    Column.createColumn({ key: COLUMN_KEYS.CREATED_AT }),
    Column.createColumn({ key: COLUMN_KEYS.UPDATED_AT }),
    Column.createActionsColumn()
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, MatIconTestingModule, BrowserAnimationsModule],
        declarations: [TableComponent],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
      store = TestBed.inject(MockStore);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columns = columns;
    component.dataSource = new TestDataSource(store as Store<AppState>);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
