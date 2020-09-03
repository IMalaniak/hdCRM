/* NgRx */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState, layoutFeatureKey } from './layout.reducer';

// Selector functions
const getLayoutFeatureState = createFeatureSelector<LayoutState>(layoutFeatureKey);

export const getLeftSidebarState = createSelector(getLayoutFeatureState, (state) => state.hideLeftSidebar);
export const getRightSidebarState = createSelector(getLayoutFeatureState, (state) => state.hideRightSidebar);
export const getDarkThemeState = createSelector(getLayoutFeatureState, (state) => state.enableDarkTheme);
export const getScalledFontState = createSelector(getLayoutFeatureState, (state) => state.scaleFontUp);
