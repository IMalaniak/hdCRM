import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { State } from '../_models';
import { UserActions, UserActionTypes } from './user.actions';


export interface StatesState extends EntityState<State> {
  allStatesLoaded: boolean;
  error: string;
}

export const adapter: EntityAdapter<State> = createEntityAdapter<State>({

});

export const initialStatesState: StatesState = adapter.getInitialState({
  allStatesLoaded: false,
  error: null
});


export function statesReducer(state = initialStatesState , action: UserActions): StatesState {

  switch (action.type) {

    case UserActionTypes.AllStatesLoaded:
      return adapter.addAll(action.payload.states, {...state, allStatesLoaded: true});

    default: {
      return state;
    }

  }
}


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
