import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state.reducer';

export const selectStatesState = createFeatureSelector<fromState.StatesState>(fromState.statesFeatureKey);

export const selectAllStates = createSelector(selectStatesState, fromState.selectAll);

export const allStatesLoaded = createSelector(selectStatesState, (stateState) => stateState.allStatesLoaded);
