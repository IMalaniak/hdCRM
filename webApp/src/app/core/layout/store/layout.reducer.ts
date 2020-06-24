import * as LayoutActions from './layout.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface LayoutState {
  hideLeftSidebar: boolean;
  hideRightSidebar: boolean;
  switchThemeMode: boolean;
  resizeFont: boolean;
}

const initialState: LayoutState = {
  hideLeftSidebar: false,
  hideRightSidebar: false,
  switchThemeMode: false,
  resizeFont: false
};

const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.leftSidebarChangeState, (state, { minimized }) => ({ ...state, hideLeftSidebar: minimized })),
  on(LayoutActions.rightSidebarChangeState, (state, { minimized }) => ({ ...state, hideRightSidebar: minimized })),
  on(LayoutActions.themeModeChangeState, (state, { switched }) => ({ ...state, switchThemeMode: switched })),
  on(LayoutActions.fontSizeChangeState, (state, { resized }) => ({ ...state, resizeFont: resized })),
  on(LayoutActions.initLayoutSettings, (state, { settings }) => ({ ...state, ...settings }))
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}

export const layoutFeatureKey = 'layout';
