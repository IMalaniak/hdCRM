import { createAction, props } from '@ngrx/store';

const detailsPrefix = '[User Details]';
const listPrefix = '[User List]';

interface SelectionPopup {
  selectedUsersIds: number[];
  singleSelection?: boolean;
}

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const prepareSelectionPopup = createAction(
  `${listPrefix} Prepare Selection Dialog Popup`,
  ({ selectedUsersIds, singleSelection = false }: SelectionPopup) => ({ selectedUsersIds, singleSelection })
);
export const resetSelectionPopup = createAction(`${listPrefix} Reset Selection Dialog Popup`);
