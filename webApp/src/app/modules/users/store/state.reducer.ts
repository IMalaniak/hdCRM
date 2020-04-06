import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { State } from '../models';
import * as StateActions from './state.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface StatesState extends EntityState<State> {
  allStatesLoaded: boolean;
  error: string;
}

const adapter: EntityAdapter<State> = createEntityAdapter<State>({});

const initialState: StatesState = adapter.getInitialState({
  allStatesLoaded: false,
  error: null
});

const statesReducer = createReducer(
  initialState,
  on(StateActions.allStatesLoaded, (state, { list }) =>
    adapter.addAll(list, {
      ...state,
      allStatesLoaded: true
    })
  )
);

export function reducer(state: StatesState | undefined, action: Action) {
  return statesReducer(state, action);
}

export const statesFeatureKey = 'states';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
