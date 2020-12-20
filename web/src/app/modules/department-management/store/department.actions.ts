import { createAction, props } from '@ngrx/store';

const detailsPrefix = '[Department Details]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);
