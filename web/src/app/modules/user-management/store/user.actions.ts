import { createAction, props } from '@ngrx/store';

const detailsPrefix = '[User Details]';
const listPrefix = '[User List]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const prepareSelectionPopup = createAction(
  `${listPrefix} Prepare Selection Dialog Popup`,
  props<{ selectedUsersIds: number[] }>()
);
export const resetSelectionPopup = createAction(`${listPrefix} Reset Selection Dialog Popup`);
