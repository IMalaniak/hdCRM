import { createAction, props } from '@ngrx/store';
import { LayoutState } from './layout.reducer';

export const toggleLeftSidebar = createAction(
  '[Layout] Toggle Left Sidebar',
  props<{ minimized: boolean }>()
);

export const leftSidebarChangeState = createAction(
  '[Layout] Left Sidebar State Changed',
  props<{ minimized: boolean }>()
);

export const toggleRightSidebar = createAction(
  '[Layout] Toggle Right Sidebar',
  props<{ minimized: boolean }>()
);

export const rightSidebarChangeState = createAction(
  '[Layout] Right Sidebar State Changed',
  props<{ minimized: boolean }>()
);

export const toogleThemeMode = createAction(
  '[Layout] Toggle Theme Mode',
  props<{ switched: boolean }>()
);

export const themeModeChangeState = createAction(
  '[Layout] Theme Mode State Changed',
  props<{ switched: boolean }>()
);

export const toogleFontSize = createAction(
  '[Layout] Toggle Font Size',
  props<{ resized: boolean }>()
);

export const fontSizeChangeState = createAction(
  '[Layout] Font Size State Changed',
  props<{ resized: boolean }>()
);

export const initLayoutSettings = createAction(
  '[Layout] Init Layout Settings',
  props<{ settings: LayoutState }>()
);
