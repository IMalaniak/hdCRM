import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ToggleSidebar = '[Layout] Toggle Sidebar',
  SidebarChangeState = '[Layout] Sidebar state changed'
}

// Action Creators
export class ToggleSidebar implements Action {
  readonly type = LayoutActionTypes.ToggleSidebar;
  constructor(public payload: boolean) {}
}

export class SidebarChangeState implements Action {
  readonly type = LayoutActionTypes.SidebarChangeState;
  constructor(public payload: boolean) {}
}

// Union the valid types
export type LayoutActions = ToggleSidebar | SidebarChangeState;
