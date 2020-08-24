import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { State } from '../models';
import * as StateActions from './state.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface StatesState extends EntityState<State> {
  allStatesLoaded: boolean;
  loading: boolean;
}

const adapter: EntityAdapter<State> = createEntityAdapter<State>({});

const initialState: StatesState = adapter.getInitialState({
  allStatesLoaded: false,
  loading: false
});

const statesReducer = createReducer(
  initialState,
  on(StateActions.allStatesRequested, state => ({ ...state, loading: true })),
  on(StateActions.allStatesLoaded, (state, { list }) =>
    adapter.setAll(list, {
      ...state,
      allStatesLoaded: true,
      loading: false
    })
  ),
  on(StateActions.statesApiError, state => ({ ...state, loading: false }))
);

export function reducer(state: StatesState | undefined, action: Action) {
  return statesReducer(state, action);
}

export const statesFeatureKey = 'states';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
