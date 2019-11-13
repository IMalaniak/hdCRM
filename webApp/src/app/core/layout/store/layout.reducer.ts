import { LayoutActionTypes, LayoutActions } from './layout.actions';

export interface LayoutState {
  hideSideBar: boolean;
}

const initialState: LayoutState = {
  hideSideBar: false
};

export function layoutReducer(state = initialState, action: LayoutActions): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.SidebarChangeState:
      return {
        ...state,
        hideSideBar: action.payload
      };

    default:
      return state;
  }
}
