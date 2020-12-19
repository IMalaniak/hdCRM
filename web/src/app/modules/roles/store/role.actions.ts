import { createAction, props } from '@ngrx/store';

const detailsPrefix = '[Role Details]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);
