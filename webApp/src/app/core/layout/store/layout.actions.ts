import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ToggleLeftSidebar = '[Layout] Toggle Left Sidebar',
  LeftSidebarChangeState = '[Layout] Left Sidebar State Changed',
  ToggleRightSidebar = '[Layout] Toogle Right Sidebar',
  RightSidebarChangeState = '[Layout] Right Sidebar State Changed',
}

// Action Creators
export class ToggleLeftSidebar implements Action {
  readonly type = LayoutActionTypes.ToggleLeftSidebar;
  constructor(public payload: boolean) {}
}

export class LeftSidebarChangeState implements Action {
  readonly type = LayoutActionTypes.LeftSidebarChangeState;
  constructor(public payload: boolean) {}
}

export class ToggleRightSidebar implements Action {
  readonly type = LayoutActionTypes.ToggleRightSidebar;
  constructor(public payload: boolean) {}
}

export class RightSidebarChangeState implements Action {
  readonly type = LayoutActionTypes.RightSidebarChangeState;
  constructor(public payload: boolean) {}
}

// Union the valid types
export type LayoutActions = ToggleLeftSidebar | LeftSidebarChangeState | ToggleRightSidebar | RightSidebarChangeState;
