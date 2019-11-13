/* NgRx */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState } from './layout.reducer';

// Selector functions
const getLayoutFeatureState = createFeatureSelector<LayoutState>('layout');

export const getSidebarState = createSelector(getLayoutFeatureState, state => state.hideSideBar);
