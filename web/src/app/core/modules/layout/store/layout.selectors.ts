import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LayoutState, layoutFeatureKey } from './layout.reducer';

const getLayoutFeatureState = createFeatureSelector<LayoutState>(layoutFeatureKey);
export const tableConfigState = createSelector(getLayoutFeatureState, (state) => state.tableConfig);

export const getSidebarState = createSelector(getLayoutFeatureState, (state) => state.hideSidebar);
export const getDarkThemeState = createSelector(getLayoutFeatureState, (state) => state.enableDarkTheme);
export const getScalledFontState = createSelector(getLayoutFeatureState, (state) => state.scaleFontUp);

export const userDropdownVisible = createSelector(getLayoutFeatureState, (state) => state.userDropdownVisible);

export const tableColumnsToDisplay = (key: string) =>
  createSelector(tableConfigState, (state) =>
    state.entities[key]?.columns?.filter((c) => c.isVisible).map((c) => c.title)
  );
