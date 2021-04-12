import { createReducer, on, Action } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TableConfig } from '@/shared/models/table';
import * as LayoutActions from './layout.actions';

const tableConfigAdapter: EntityAdapter<TableConfig> = createEntityAdapter<TableConfig>({
  selectId: (table: TableConfig) => table.key
});

export const initialTableConfigState: EntityState<TableConfig> = tableConfigAdapter.getInitialState();
export interface LayoutState {
  hideSidebar: boolean;
  enableDarkTheme: boolean;
  scaleFontUp: boolean;
  userDropdownVisible: boolean;
  tableConfig: EntityState<TableConfig>;
}

export const initialLayoutState: LayoutState = {
  hideSidebar: false,
  enableDarkTheme: false,
  scaleFontUp: false,
  userDropdownVisible: false,
  tableConfig: initialTableConfigState
};

const layoutReducer = createReducer(
  initialLayoutState,
  on(LayoutActions.toggleUserDropdown, (state) => ({
    ...state,
    userDropdownVisible: !state.userDropdownVisible
  })),
  on(LayoutActions.closeUserDropdown, (state) => ({
    ...state,
    userDropdownVisible: false
  })),
  on(LayoutActions.sidebarChangeState, (state, { minimized }) => ({ ...state, hideSidebar: minimized })),
  on(LayoutActions.darkThemeChangeState, (state, { enabled }) => ({ ...state, enableDarkTheme: enabled })),
  on(LayoutActions.scaleFontUpChangeState, (state, { scaled }) => ({ ...state, scaleFontUp: scaled })),
  on(LayoutActions.initLayoutSettings, (state, { settings }) => ({ ...state, ...settings })),
  on(LayoutActions.setTableConfig, (state, { tableConfig }) => ({
    ...state,
    tableConfig: tableConfigAdapter.upsertOne(tableConfig, { ...state.tableConfig })
  })),
  on(LayoutActions.removeTableConfig, (state, { key }) => ({
    ...state,
    tableConfig: tableConfigAdapter.removeOne(key, { ...state.tableConfig })
  }))
);

export const reducer = (state: LayoutState | undefined, action: Action) => layoutReducer(state, action);

export const layoutFeatureKey = 'layout';
