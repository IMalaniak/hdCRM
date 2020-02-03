import { LayoutActionTypes, LayoutActions } from './layout.actions';

export interface LayoutState {
  hideLeftSidebar: boolean;
  hideRightSidebar: boolean;
}

const initialState: LayoutState = {
  hideLeftSidebar: false,
  hideRightSidebar: false
};

export function layoutReducer(state = initialState, action: LayoutActions): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.LeftSidebarChangeState:
      return {
        ...state,
        hideLeftSidebar: action.payload
      };

    case LayoutActionTypes.RightSidebarChangeState:
      return {
        ...state,
        hideRightSidebar: action.payload
      };

    case LayoutActionTypes.INIT_LAYOUT_SETTINGS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}
