import * as dynamicFormActions from './dynamic-form.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DynamicForm } from '@/shared/models';

export interface DynamicFormState extends EntityState<DynamicForm> {
  isLoading: boolean;
}

const adapter: EntityAdapter<DynamicForm> = createEntityAdapter<DynamicForm>({
  selectId: (form: DynamicForm) => form.key
});

export const initialFormsState: DynamicFormState = adapter.getInitialState({
  isLoading: false
});

const dynamicFormReducer = createReducer(
  initialFormsState,
  on(dynamicFormActions.formRequested, (state) => ({ ...state, isLoading: true })),
  on(dynamicFormActions.formLoaded, (state, { form }) =>
    adapter.addOne(form, {
      ...state,
      isLoading: false
    })
  ),
  on(dynamicFormActions.formsApiError, (state) => ({ ...state, isLoading: false }))
);

export const formReducer = (state: DynamicFormState | undefined, action: Action) => dynamicFormReducer(state, action);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
